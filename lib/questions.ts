import type { Question } from "./types";

const cache: Record<string, Question[]> = {};

export async function loadTopicQuestions(topic: string, playlist: "statistics" | "machine-learning" = "statistics"): Promise<Question[]> {
  const cacheKey = `${playlist}:${topic}`;
  if (cache[cacheKey]) return cache[cacheKey];
  try {
    const basePath = playlist === "machine-learning" ? `/questions/ml/${topic}.json` : `/questions/${topic}.json`;
    const res = await fetch(basePath);
    if (!res.ok) throw new Error(`Failed to load ${topic}`);
    const data: Question[] = await res.json();
    const tagged = data
      .filter((q) => Array.isArray(q.options) && q.options.length > 0 && q.question)
      .map((q) => ({ ...q, playlist: q.playlist ?? playlist }));
    cache[cacheKey] = tagged;
    return tagged;
  } catch {
    return [];
  }
}

export async function loadPlaylistQuestions(playlist: "statistics" | "machine-learning"): Promise<Question[]> {
  const { STATS_TOPICS, ML_TOPICS } = await import("./topics");
  const topics = playlist === "statistics" ? STATS_TOPICS : ML_TOPICS;
  const results = await Promise.all(topics.map((t) => loadTopicQuestions(t.slug, playlist)));
  return results.flat();
}

export async function loadAllQuestions(): Promise<Question[]> {
  const stats = await loadPlaylistQuestions("statistics");
  const ml = await loadPlaylistQuestions("machine-learning");
  return [...stats, ...ml];
}

export function shuffleOptions(question: Question): { question: Question; correctIndex: number } {
  if (!Array.isArray(question.options) || question.options.length === 0) {
    return { question, correctIndex: question.correctIndex };
  }
  const indexed = question.options.map((opt, i) => ({ opt, i }));
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  const newCorrectIndex = indexed.findIndex((x) => x.i === question.correctIndex);
  return {
    question: { ...question, options: indexed.map((x) => x.opt) },
    correctIndex: newCorrectIndex,
  };
}

export function filterQuestions(
  questions: Question[],
  difficulty: string,
  seenIds: string[]
): Question[] {
  let filtered = questions;
  if (difficulty !== "all") {
    filtered = filtered.filter((q) => q.difficulty === difficulty);
  }
  const unseen = filtered.filter((q) => !seenIds.includes(q.id));
  return unseen.length > 0 ? unseen : filtered;
}

export function fisherYates<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
