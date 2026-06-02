"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getTopicLabel } from "@/lib/topics";
import HamburgerNav from "@/components/HamburgerNav";

interface TopicBreakdown { correct: number; total: number; }

function getMotivation(pct: number): { message: string; sub: string } {
  if (pct >= 90) return { message: "Outstanding.", sub: "You have a strong grasp of these concepts. Josh Starmer would be proud." };
  if (pct >= 70) return { message: "Solid work.", sub: "You understand the core ideas. A few more rounds will sharpen the edges." };
  if (pct >= 50) return { message: "Making progress.", sub: "Halfway there. Review the topics where you struggled and try again." };
  return { message: "Keep going.", sub: "Statistics and ML take time to click. Review the StatQuest videos for the topics below." };
}

function scoreColor(pct: number) {
  if (pct >= 80) return "text-sq-green";
  if (pct >= 50) return "text-[#8a6000]";
  return "text-sq-red";
}

function barColor(pct: number) {
  if (pct >= 70) return "bg-sq-green";
  if (pct >= 50) return "bg-sq-yellow";
  return "bg-sq-red";
}

export default function ResultsClient() {
  const params = useSearchParams();
  const score = parseInt(params.get("score") ?? "0");
  const total = parseInt(params.get("total") ?? "0");
  const topic = params.get("topic") ?? "all";
  const playlist = (params.get("playlist") ?? "statistics") as "statistics" | "machine-learning";
  const breakdownRaw = params.get("breakdown") ?? "{}";

  let breakdown: Record<string, TopicBreakdown> = {};
  try { breakdown = JSON.parse(decodeURIComponent(breakdownRaw)); } catch { breakdown = {}; }

  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const { message, sub } = getMotivation(pct);

  const topicResults = Object.entries(breakdown)
    .map(([slug, { correct, total: t }]) => ({ slug, label: getTopicLabel(slug), correct, total: t, pct: t > 0 ? Math.round((correct / t) * 100) : 0 }))
    .sort((a, b) => a.pct - b.pct);

  const worstTopic = topicResults[0]?.slug ?? topic;

  return (
    <div className="min-h-screen bg-paper notebook-lines">
      <HamburgerNav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* Score hero */}
        <div className="border-2 border-ink bg-white rounded-sm p-5 sm:p-8 mb-6 text-center shadow-sketch">
          <div className={`font-hand mb-2 ${scoreColor(pct)}`} style={{ fontSize: "clamp(52px, 14vw, 96px)", lineHeight: 1 }}>
            {pct}%
          </div>
          <div className="font-hand text-ink text-xl mb-1">{score} correct out of {total} questions</div>
          <div className="font-body text-muted text-sm mb-1">{message}</div>
          <p className="font-body text-muted text-sm max-w-md mx-auto leading-relaxed">{sub}</p>

          {/* Chunky progress bar */}
          <div className="mt-6 mx-auto w-52 h-3 bg-surface border-2 border-ink overflow-hidden" style={{ borderRadius: 0 }}>
            <div
              className={`h-full transition-all duration-700 ${barColor(pct)}`}
              style={{ width: `${pct}%`, borderRadius: 0 }}
            />
          </div>
        </div>

        {/* Topic breakdown */}
        {topicResults.length > 0 && (
          <div className="border-2 border-ink bg-white rounded-sm overflow-hidden mb-6 shadow-sketch">
            <div className="px-4 sm:px-6 py-4 border-b-2 border-ink/10">
              <h2 className="font-hand text-2xl text-ink">Topic Breakdown</h2>
              <p className="font-body text-muted text-sm mt-0.5">Sorted by performance — weakest first</p>
            </div>
            <div className="divide-y divide-ink/8">
              {topicResults.map(({ slug, label, correct, total: t, pct: tPct }) => (
                <div key={slug} className="px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
                  {/* Whiteboard bullet */}
                  <span className="font-hand text-sq-red text-lg shrink-0 leading-none">●</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-hand text-ink text-sm">{label}</span>
                      <span className="font-mono text-muted text-xs shrink-0">{correct}/{t} · {tPct}%</span>
                    </div>
                    <div className="h-2.5 bg-surface border-2 border-ink/20 overflow-hidden" style={{ borderRadius: 0 }}>
                      <div
                        className={`h-full transition-all ${barColor(tPct)}`}
                        style={{ width: `${tPct}%`, borderRadius: 0 }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/quiz?playlist=${playlist}&topic=${worstTopic}`}
            className="flex-1 flex items-center justify-center gap-2 bg-sq-red text-white font-hand text-base px-6 py-3 border-2 border-ink rounded-sm shadow-sketch hover:-translate-x-px hover:-translate-y-px hover:shadow-sketch-hover transition-all"
          >
            Retake Weakest Topic
          </Link>
          <Link
            href={`/quiz?playlist=${playlist}`}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-ink font-hand text-base px-6 py-3 border-2 border-ink rounded-sm shadow-sketch hover:-translate-x-px hover:-translate-y-px hover:shadow-sketch-hover transition-all"
          >
            Choose New Topic
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 bg-white text-muted font-hand text-base px-6 py-3 border-2 border-ink/30 rounded-sm hover:border-ink hover:text-ink hover:shadow-sketch-sm transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
