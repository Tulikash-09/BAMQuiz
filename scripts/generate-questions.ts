/**
 * BAM! Quiz — Question Bank Generator
 *
 * Usage:
 *   npm run generate                        # generates both playlists
 *   npm run generate -- --playlist=stats    # statistics only
 *   npm run generate -- --playlist=ml       # machine learning only
 *
 * Requires GEMINI_API_KEY in .env.local
 * Progress is saved after each batch so the script is safely resumable.
 */

import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("ERROR: GEMINI_API_KEY not found in .env.local");
  process.exit(1);
}

// ── CLI flag ──────────────────────────────────────────────────────────────────
const playlistArg = process.argv.find((a) => a.startsWith("--playlist="))?.split("=")[1] ?? "all";
const RUN_STATS = playlistArg === "stats" || playlistArg === "statistics" || playlistArg === "all";
const RUN_ML = playlistArg === "ml" || playlistArg === "machine-learning" || playlistArg === "all";

// ── Paths ─────────────────────────────────────────────────────────────────────
const STATS_OUT_DIR = path.join(process.cwd(), "public", "questions");
const ML_OUT_DIR = path.join(process.cwd(), "public", "questions", "ml");
const PROGRESS_FILE = path.join(process.cwd(), "public", "questions", ".progress.json");

const DELAY_MS = 1000;
const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
const STYLES = ["conceptual", "calculation", "scenario", "misconception", "interpretation"] as const;

// ── Statistics playlist config ─────────────────────────────────────────────
const STATS_QUESTIONS_PER_CALL = 17;
const STATS_TOPICS: Record<string, string> = {
  "histograms-distributions": "Histograms & Distributions",
  "mean-median-mode": "Mean, Median & Mode",
  "variance-standard-deviation": "Variance & Standard Deviation",
  "normal-distribution": "Normal Distribution",
  "probability": "Probability",
  "hypothesis-testing": "Hypothesis Testing",
  "p-values-significance": "P-Values & Statistical Significance",
  "confidence-intervals": "Confidence Intervals",
  "t-tests": "T-Tests",
  "anova": "ANOVA",
  "linear-regression": "Linear Regression",
  "correlation": "Correlation",
  "bayesian-statistics": "Bayesian Statistics",
  "central-limit-theorem": "Central Limit Theorem",
  "chi-square-tests": "Chi-Square Tests",
  "logistic-regression": "Logistic Regression",
  "sensitivity-specificity": "Sensitivity & Specificity",
  "bootstrapping": "Bootstrapping",
  "multiple-testing": "Multiple Testing & Corrections",
  "covariance-correlation": "Covariance & Correlation",
};

// ── Machine Learning playlist config ──────────────────────────────────────
const ML_QUESTIONS_PER_CALL = 25;
const ML_TOPICS: Record<string, string> = {
  "decision-trees": "Decision Trees",
  "random-forests": "Random Forests",
  "gradient-boosting": "Gradient Boosting",
  "xgboost": "XGBoost",
  "support-vector-machines": "Support Vector Machines",
  "neural-networks-basics": "Neural Networks Basics",
  "backpropagation": "Backpropagation",
  "pca-dimensionality-reduction": "PCA & Dimensionality Reduction",
  "clustering-kmeans-hierarchical": "Clustering (K-Means & Hierarchical)",
  "cross-validation": "Cross-Validation",
  "bias-variance-tradeoff": "Bias-Variance Tradeoff",
  "regularisation-l1-l2": "Regularisation (L1 & L2)",
  "logistic-regression-ml": "Logistic Regression (ML)",
  "naive-bayes": "Naive Bayes",
  "k-nearest-neighbours": "K-Nearest Neighbours",
  "ensemble-methods": "Ensemble Methods",
  "loss-functions": "Loss Functions",
  "overfitting-underfitting": "Overfitting & Underfitting",
  "feature-engineering": "Feature Engineering",
  "model-evaluation-metrics": "Model Evaluation Metrics",
  "linear-regression-ml": "Linear Regression (ML)",
  "gradient-descent": "Gradient Descent",
  "roc-auc": "ROC Curves & AUC",
  "entropy-information-gain": "Entropy & Information Gain",
  "odds-log-odds": "Odds, Log(Odds) & Odds Ratios",
  "adaboost": "AdaBoost",
  "deep-learning-fundamentals": "Deep Learning Fundamentals",
  "recurrent-neural-networks": "Recurrent Neural Networks (RNNs)",
  "attention-transformers": "Attention & Transformers",
  "encoding-categorical-data": "Encoding Categorical Data",
};

const ML_EXTRA_CONTEXT = `
Additional context: This question is based on Josh Starmer's StatQuest Machine Learning playlist.
Ground the question in intuitive, visual explanations rather than heavy mathematical formalism —
consistent with Josh's teaching style. Avoid questions that require calculus;
focus on understanding what algorithms do, when to use them, and how to interpret their outputs.
`;

// ── Utilities ─────────────────────────────────────────────────────────────────
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadProgress(): Set<string> {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      return new Set(JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8")) as string[]);
    }
  } catch { /* ignore */ }
  return new Set();
}

function saveProgress(done: Set<string>) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify([...done], null, 2));
}

function progressKey(playlist: string, topic: string, difficulty: string, style: string) {
  return `${playlist}::${topic}::${difficulty}::${style}`;
}

function parseJsonSafe(raw: string): object[] {
  try { return JSON.parse(raw) as object[]; } catch { /* fall through */ }
  const repaired = raw
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/(['"])?([a-zA-Z_][a-zA-Z0-9_]*)(['"])?\s*:/g, '"$2":')
    .replace(/:\s*'([^']*)'/g, ': "$1"');
  return JSON.parse(repaired) as object[];
}

function buildStatsPrompt(topic: string, label: string, difficulty: string, style: string): string {
  return `You are a statistics education expert. Generate exactly ${STATS_QUESTIONS_PER_CALL} unique multiple-choice questions about "${label}" for the "${difficulty}" level. Question style: "${style}".

Style definitions:
- conceptual: tests understanding of definitions and theory
- calculation: gives numbers and asks the student to reason about the result
- scenario: describes a real-world research situation and asks what to do
- misconception: presents a common wrong belief and asks the student to identify the error
- interpretation: gives a statistical output (e.g. "p = 0.03, n = 45") and asks what it means

Difficulty definitions:
- beginner: first exposure, plain language, no jargon without explanation
- intermediate: assumes basic stats knowledge, introduces formal terminology
- advanced: assumes solid foundations, tests nuance, edge cases, and common expert-level mistakes

Rules:
- Every question must be genuinely distinct — different angle, different phrasing, different concept tested
- Do NOT repeat question stems or reword the same idea
- All 4 options must be plausible — no obviously wrong distractors
- Explanation must address WHY the correct answer is right AND why the most tempting wrong answer is wrong
- Ground questions in the StatQuest Statistics Fundamentals playlist content

Return ONLY a valid JSON array, no markdown, no commentary:
[
  {
    "id": "${topic.substring(0, 4)}-[3-digit-number]",
    "topic": "${topic}",
    "subtopic": "[specific subtopic]",
    "difficulty": "${difficulty}",
    "style": "${style}",
    "playlist": "statistics",
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "correctIndex": 0,
    "explanation": "..."
  }
]`;
}

function buildMLPrompt(topic: string, label: string, difficulty: string, style: string): string {
  return `You are a machine learning education expert. Generate exactly ${ML_QUESTIONS_PER_CALL} unique multiple-choice questions about "${label}" for the "${difficulty}" level. Question style: "${style}".
${ML_EXTRA_CONTEXT}
Style definitions:
- conceptual: tests understanding of how the algorithm works and its assumptions
- calculation: gives a small numerical example and asks the student to reason about the result
- scenario: describes a real-world ML problem and asks what to do or what will happen
- misconception: presents a common wrong belief about the algorithm and asks the student to identify the error
- interpretation: gives a model output or metric and asks what it means

Difficulty definitions:
- beginner: first exposure, plain language, intuitive explanations, no heavy math
- intermediate: assumes familiarity with basic ML concepts, introduces proper terminology
- advanced: tests nuance, edge cases, when algorithms fail, and expert-level subtleties

Rules:
- Every question must be genuinely distinct — different angle, different phrasing, different concept tested
- Do NOT repeat question stems or reword the same idea
- All 4 options must be plausible — no obviously wrong distractors
- Explanation must address WHY the correct answer is right AND why the most tempting wrong answer is wrong

Return ONLY a valid JSON array, no markdown, no commentary:
[
  {
    "id": "${topic.substring(0, 4)}-[3-digit-number]",
    "topic": "${topic}",
    "subtopic": "[specific subtopic]",
    "difficulty": "${difficulty}",
    "style": "${style}",
    "playlist": "machine-learning",
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "correctIndex": 0,
    "explanation": "..."
  }
]`;
}

const FALLBACK_MODELS = ["gemini-3.1-flash-lite", "gemini-3.5-flash"];

async function callGemini(prompt: string, attempt = 0): Promise<object[] | null> {
  const model = FALLBACK_MODELS[Math.min(Math.floor(attempt / 2), FALLBACK_MODELS.length - 1)];
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  const delays = [0, 5000, 15000, 30000, 60000];
  const waitMs = delays[Math.min(attempt, delays.length - 1)];

  if (attempt > 0) {
    console.log(`    Attempt ${attempt + 1} using ${model} (waiting ${waitMs / 1000}s)…`);
    await sleep(waitMs);
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 8192 },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      if ((res.status === 503 || res.status === 429) && attempt < 4) {
        console.log(`    ${res.status} from ${model} — will retry`);
        return callGemini(prompt, attempt + 1);
      }
      throw new Error(`API error ${res.status}: ${errText}`);
    }

    const data = await res.json() as { candidates?: Array<{ content: { parts: Array<{ text: string }> } }> };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("No JSON array found in response");
    return parseJsonSafe(match[0]);
  } catch (err) {
    if (attempt < 4) {
      console.log(`    Error: ${(err as Error).message} — retrying`);
      return callGemini(prompt, attempt + 1);
    }
    console.log(`    Failed after ${attempt + 1} attempts: ${(err as Error).message}`);
    return null;
  }
}

function normalize(text: string): string {
  const stopwords = new Set(["the", "a", "an", "is", "it", "in", "of", "to", "and", "or", "for", "with", "that", "what", "which", "when", "why", "how", "are", "be", "by", "as", "at", "on", "if", "not", "this", "you", "from"]);
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !stopwords.has(w)).join(" ");
}

function jaccardSimilarity(a: string, b: string): number {
  const setA = new Set(a.split(" "));
  const setB = new Set(b.split(" "));
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

function deduplicate(questions: object[]): { kept: object[]; removed: number } {
  const qs = questions as Array<{ question: string; explanation: string }>;
  const normalised = qs.map((q) => normalize(q.question));
  const removed = new Set<number>();
  for (let i = 0; i < qs.length; i++) {
    if (removed.has(i)) continue;
    for (let j = i + 1; j < qs.length; j++) {
      if (removed.has(j)) continue;
      if (jaccardSimilarity(normalised[i], normalised[j]) > 0.75) {
        if ((qs[i].explanation?.length ?? 0) >= (qs[j].explanation?.length ?? 0)) removed.add(j);
        else { removed.add(i); break; }
      }
    }
  }
  return { kept: qs.filter((_, i) => !removed.has(i)), removed: removed.size };
}

// ── Core generation loop ──────────────────────────────────────────────────────
async function generatePlaylist(
  playlistName: string,
  topics: Record<string, string>,
  outDir: string,
  questionsPerCall: number,
  buildPrompt: (slug: string, label: string, diff: string, style: string) => string,
  done: Set<string>
): Promise<{ generated: number; removed: number; finalCount: number; perTopic: Record<string, number> }> {
  let generated = 0;
  let removed = 0;
  const perTopic: Record<string, number> = {};

  fs.mkdirSync(outDir, { recursive: true });

  for (const [slug, label] of Object.entries(topics)) {
    const filePath = path.join(outDir, `${slug}.json`);

    const allBatchesDone = DIFFICULTIES.every((d) => STYLES.every((s) => done.has(progressKey(playlistName, slug, d, s))));
    if (allBatchesDone) {
      const count = fs.existsSync(filePath) ? (JSON.parse(fs.readFileSync(filePath, "utf-8")) as object[]).length : 0;
      console.log(`[${playlistName}/${slug}] ✓ Already complete (${count} questions) — skipping\n`);
      perTopic[slug] = count;
      continue;
    }

    let existing: object[] = [];
    if (fs.existsSync(filePath)) {
      try { existing = JSON.parse(fs.readFileSync(filePath, "utf-8")) as object[]; console.log(`[${playlistName}/${slug}] Found ${existing.length} existing questions`); }
      catch { console.log(`[${playlistName}/${slug}] Existing file corrupted — regenerating`); }
    }

    const newQs: object[] = [];

    for (const difficulty of DIFFICULTIES) {
      for (const style of STYLES) {
        const key = progressKey(playlistName, slug, difficulty, style);
        if (done.has(key)) { console.log(`  [${slug}] ${difficulty}/${style}: ✓ already done — skipping`); continue; }

        const prompt = buildPrompt(slug, label, difficulty, style);
        const qs = await callGemini(prompt);

        if (qs) {
          newQs.push(...qs);
          generated += qs.length;
          done.add(key);
          saveProgress(done);
          console.log(`  [${slug}] ${difficulty}/${style}: ${qs.length} questions (total this run: ${generated})`);
        } else {
          console.log(`  [${slug}] ${difficulty}/${style}: SKIPPED (API error)`);
        }

        await sleep(DELAY_MS);
      }
    }

    const combined = [...existing, ...newQs];
    const { kept, removed: r } = deduplicate(combined);
    removed += r;
    fs.writeFileSync(filePath, JSON.stringify(kept, null, 2));
    perTopic[slug] = kept.length;
    console.log(`[${playlistName}/${slug}] Saved ${kept.length} questions (${r} removed by dedup)\n`);
  }

  const finalCount = Object.values(perTopic).reduce((a, b) => a + b, 0);
  return { generated, removed, finalCount, perTopic };
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("=== BAM! Quiz — Question Generator ===\n");
  console.log(`Playlists: ${[RUN_STATS && "Statistics", RUN_ML && "Machine Learning"].filter(Boolean).join(" + ")}\n`);

  const done = loadProgress();
  if (done.size > 0) console.log(`Resuming — ${done.size} batches already completed.\n`);

  const summary: Array<{ playlist: string; topics: number; generated: number; afterDedup: number }> = [];

  if (RUN_STATS) {
    console.log("━━━ STATISTICS PLAYLIST ━━━\n");
    const res = await generatePlaylist(
      "statistics", STATS_TOPICS, STATS_OUT_DIR,
      STATS_QUESTIONS_PER_CALL, buildStatsPrompt, done
    );
    summary.push({ playlist: "Statistics", topics: Object.keys(STATS_TOPICS).length, generated: res.generated, afterDedup: res.finalCount });
    console.log("\nStatistics per-topic:");
    for (const [slug, count] of Object.entries(res.perTopic)) console.log(`  ${slug.padEnd(35)} ${count}`);
  }

  if (RUN_ML) {
    console.log("\n━━━ MACHINE LEARNING PLAYLIST ━━━\n");
    const res = await generatePlaylist(
      "machine-learning", ML_TOPICS, ML_OUT_DIR,
      ML_QUESTIONS_PER_CALL, buildMLPrompt, done
    );
    summary.push({ playlist: "Machine Learning", topics: Object.keys(ML_TOPICS).length, generated: res.generated, afterDedup: res.finalCount });
    console.log("\nML per-topic:");
    for (const [slug, count] of Object.entries(res.perTopic)) console.log(`  ${slug.padEnd(35)} ${count}`);
  }

  // Clean up progress file on full completion
  if (RUN_STATS && RUN_ML && fs.existsSync(PROGRESS_FILE)) fs.unlinkSync(PROGRESS_FILE);

  // Summary table
  const col = (s: string | number, w: number) => String(s).padEnd(w);
  console.log("\n" + "─".repeat(65));
  console.log(`${col("Playlist", 22)} ${col("Topics", 8)} ${col("Generated", 14)} ${col("After Dedup", 12)}`);
  console.log("─".repeat(65));
  let totalGen = 0, totalFinal = 0;
  for (const row of summary) {
    console.log(`${col(row.playlist, 22)} ${col(row.topics, 8)} ${col(row.generated, 14)} ${col(row.afterDedup, 12)}`);
    totalGen += row.generated;
    totalFinal += row.afterDedup;
  }
  console.log("─".repeat(65));
  console.log(`${col("Total", 22)} ${col(summary.reduce((a, b) => a + b.topics, 0), 8)} ${col(totalGen, 14)} ${col(totalFinal, 12)}`);
  console.log("─".repeat(65) + "\n");
}

main().catch((err) => { console.error("Fatal error:", err); process.exit(1); });
