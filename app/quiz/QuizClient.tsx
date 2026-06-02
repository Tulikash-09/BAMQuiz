"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { STATS_TOPICS, ML_TOPICS, getTopicLabel } from "@/lib/topics";
import { loadTopicQuestions, loadPlaylistQuestions, fisherYates, shuffleOptions } from "@/lib/questions";
import type { Question } from "@/lib/types";
import HamburgerNav from "@/components/HamburgerNav";

type Difficulty = "all" | "beginner" | "intermediate" | "advanced";
type Playlist = "statistics" | "machine-learning";

interface AnswerRecord {
  selectedIndex: number;
  correct: boolean;
  correctIndex: number;
}

const SEEN_KEY = "bamquiz_seen_ids";

function getSeenIds(): string[] {
  try { return JSON.parse(sessionStorage.getItem(SEEN_KEY) ?? "[]"); }
  catch { return []; }
}

function addSeenId(id: string) {
  const seen = getSeenIds();
  if (!seen.includes(id)) {
    seen.push(id);
    sessionStorage.setItem(SEEN_KEY, JSON.stringify(seen));
  }
}

const diffBadge: Record<string, string> = {
  beginner: "text-[#3a8a00] border-[#5CBF2A] bg-[#EBF7E3]",
  intermediate: "text-[#8a6000] border-[#d4a800] bg-[#FFFBEA]",
  advanced: "text-[#E8272A] border-[#E8272A] bg-[#FDECEC]",
};

export default function QuizClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPlaylist = (searchParams.get("playlist") ?? "statistics") as Playlist;
  const initialTopic = searchParams.get("topic") ?? "all";

  const [playlist, setPlaylist] = useState<Playlist>(initialPlaylist);
  const [activeTopic, setActiveTopic] = useState<string>(initialTopic);
  const [difficulty, setDifficulty] = useState<Difficulty>("all");
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [queue, setQueue] = useState<{ q: Question; correctIndex: number }[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, AnswerRecord>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const topicList = playlist === "statistics" ? STATS_TOPICS : ML_TOPICS;

  useEffect(() => {
    setLoading(true);
    const load = async () => {
      let qs: Question[];
      if (activeTopic === "all") {
        qs = await loadPlaylistQuestions(playlist);
      } else {
        qs = await loadTopicQuestions(activeTopic, playlist);
      }
      setAllQuestions(qs);
      setLoading(false);
    };
    load();
  }, [activeTopic, playlist]);

  const buildQueue = useCallback((questions: Question[], diff: Difficulty) => {
    const seenIds = getSeenIds();
    let filtered = questions;
    if (diff !== "all") filtered = questions.filter((q) => q.difficulty === diff);
    const unseen = filtered.filter((q) => !seenIds.includes(q.id));
    const pool = unseen.length > 0 ? unseen : filtered;
    const shuffled = fisherYates(pool);
    const withShuffled = shuffled.map((q) => {
      const { question, correctIndex } = shuffleOptions(q);
      return { q: question, correctIndex };
    });
    setQueue(withShuffled);
    setQueueIndex(0);
    setSelected(null);
    setAnswered(false);
  }, []);

  useEffect(() => {
    if (!loading && allQuestions.length > 0) buildQueue(allQuestions, difficulty);
  }, [allQuestions, difficulty, loading, buildQueue]);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (answered) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleNext(); }
        return;
      }
      const num = parseInt(e.key);
      if (num >= 1 && num <= 4) handleSelect(num - 1);
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  });

  const currentItem = queue[queueIndex];
  const currentQ = currentItem?.q;
  const correctIdx = currentItem?.correctIndex;

  function handleSelect(idx: number) {
    if (answered || !currentQ) return;
    setSelected(idx);
    const correct = idx === correctIdx;
    setAnswered(true);
    setTotal((t) => t + 1);
    if (correct) setScore((s) => s + 1);
    addSeenId(currentQ.id);
    setAnswers((prev) => ({ ...prev, [currentQ.id]: { selectedIndex: idx, correct, correctIndex: correctIdx } }));
  }

  function handleNext() {
    if (!answered) return;
    const nextIndex = queueIndex + 1;
    if (nextIndex >= queue.length) buildQueue(allQuestions, difficulty);
    else { setQueueIndex(nextIndex); setSelected(null); setAnswered(false); }
    containerRef.current?.focus();
  }

  function handleFinish() {
    const topicBreakdown: Record<string, { correct: number; total: number }> = {};
    for (const [id, rec] of Object.entries(answers)) {
      const q = allQuestions.find((x) => x.id === id);
      if (!q) continue;
      if (!topicBreakdown[q.topic]) topicBreakdown[q.topic] = { correct: 0, total: 0 };
      topicBreakdown[q.topic].total++;
      if (rec.correct) topicBreakdown[q.topic].correct++;
    }
    const params = new URLSearchParams({
      score: score.toString(),
      total: total.toString(),
      topic: activeTopic,
      playlist,
      breakdown: JSON.stringify(topicBreakdown),
    });
    router.push(`/results?${params.toString()}`);
  }

  function handlePlaylistSwitch(p: Playlist) {
    setPlaylist(p);
    setActiveTopic("all");
    setScore(0);
    setTotal(0);
    setAnswers({});
  }

  return (
    <div className="min-h-screen bg-paper notebook-lines flex flex-col">
      <HamburgerNav score={score} total={total} onFinish={total > 0 ? handleFinish : undefined} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 w-full flex-1 flex flex-col gap-3 sm:gap-5">

        {/* Playlist toggle */}
        <div className="flex gap-2">
          {(["statistics", "machine-learning"] as Playlist[]).map((p) => (
            <button
              key={p}
              onClick={() => handlePlaylistSwitch(p)}
              className={`flex-1 sm:flex-none px-4 py-2.5 sm:py-2 font-hand text-sm border-2 border-ink rounded-sm shadow-sketch-sm hover:-translate-x-px hover:-translate-y-px hover:shadow-sketch transition-all ${
                playlist === p ? "bg-sq-red text-white" : "bg-white text-ink"
              }`}
            >
              {p === "statistics" ? "Statistics" : "Machine Learning"}
            </button>
          ))}
        </div>

        {/* Topic filter pills — horizontal scroll on mobile, wrapping on desktop */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 pb-1 sm:pb-0 sm:flex-wrap w-max sm:w-auto">
            <button
              onClick={() => setActiveTopic("all")}
              className={`px-3 py-2.5 sm:py-1.5 font-hand text-sm border-2 border-ink rounded-sm shadow-sketch-sm hover:-translate-x-px hover:-translate-y-px hover:shadow-sketch transition-all whitespace-nowrap ${
                activeTopic === "all" ? "bg-sq-red text-white" : "bg-white text-ink"
              }`}
            >
              All Topics
            </button>
            {topicList.map((t) => (
              <button
                key={t.slug}
                onClick={() => setActiveTopic(t.slug)}
                className={`px-3 py-2.5 sm:py-1.5 font-hand text-sm border-2 border-ink rounded-sm shadow-sketch-sm hover:-translate-x-px hover:-translate-y-px hover:shadow-sketch transition-all whitespace-nowrap ${
                  activeTopic === t.slug ? "bg-sq-red text-white" : "bg-white text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty selector — horizontal scroll on mobile */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-2 pb-1 sm:pb-0 sm:flex-wrap w-max sm:w-auto">
            <span className="text-xs font-body text-muted shrink-0">Difficulty:</span>
            {(["all", "beginner", "intermediate", "advanced"] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-2.5 sm:py-1.5 font-hand text-sm border-2 border-ink rounded-sm shadow-sketch-sm hover:-translate-x-px hover:-translate-y-px hover:shadow-sketch transition-all capitalize whitespace-nowrap ${
                  difficulty === d ? "bg-sq-red text-white" : "bg-white text-ink"
                }`}
              >
                {d === "all" ? "All Levels" : d}
              </button>
            ))}
          </div>
        </div>

        {/* Progress bar — chunky, hand-drawn */}
        {total > 0 && (
          <div>
            <div className="flex items-center justify-between text-xs font-body text-muted mb-1.5">
              <span>Q{total} answered</span>
              <span className="font-mono">{score}/{total} correct ({Math.round((score / total) * 100)}%)</span>
            </div>
            <div className="h-3 bg-white border-2 border-ink overflow-hidden" style={{ borderRadius: 0 }}>
              <div
                className="h-full bg-sq-red transition-all duration-500"
                style={{ width: `${(score / total) * 100}%`, borderRadius: 0 }}
              />
            </div>
          </div>
        )}

        {/* Question card */}
        <div ref={containerRef} tabIndex={-1} className="outline-none flex-1">
          {loading ? (
            <div className="border-2 border-ink bg-white rounded-sm p-8 text-center font-body text-muted shadow-sketch">
              Loading questions…
            </div>
          ) : !currentQ ? (
            <div className="border-2 border-ink bg-white rounded-sm p-8 text-center font-body text-muted shadow-sketch">
              No questions found for this filter.
            </div>
          ) : (
            <div className="border-2 border-ink bg-white rounded-sm overflow-hidden shadow-sketch">
              {/* Card header */}
              <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b-2 border-ink/10">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {/* Question number */}
                  <span className="font-hand text-sq-red text-base">#{total + 1}</span>
                  {/* Topic badge */}
                  <span className="font-hand text-xs bg-sq-red text-white border border-sq-red/80 rounded-sm px-2.5 py-0.5 leading-snug">
                    {getTopicLabel(currentQ.topic)}
                  </span>
                  {/* Difficulty badge */}
                  <span className={`font-hand text-xs border rounded-sm px-2.5 py-0.5 leading-snug capitalize ${diffBadge[currentQ.difficulty] ?? "text-muted border-surface bg-surface"}`}>
                    {currentQ.difficulty}
                  </span>
                  {/* Style / subtopic — only show when there's room */}
                  <span className="font-body text-xs text-muted ml-auto capitalize hidden sm:block truncate max-w-[180px]">
                    {currentQ.style} · {currentQ.subtopic}
                  </span>
                </div>
                <p className="font-hand text-ink leading-relaxed text-lg sm:text-xl">
                  {currentQ.question}
                </p>
              </div>

              {/* Answer options */}
              <div className="p-3 sm:p-4 grid gap-2 sm:gap-2.5">
                {currentQ.options.map((opt, idx) => {
                  let cls = "w-full text-left px-3 sm:px-4 py-3.5 border-2 rounded-sm text-sm font-body leading-relaxed transition-all duration-150 flex items-start gap-3 min-h-[48px] ";
                  if (!answered) {
                    cls += "border-ink bg-white text-ink cursor-pointer shadow-[2px_2px_0px_#1A1A2E] hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0px_#1A1A2E] active:translate-x-px active:translate-y-px";
                  } else if (idx === correctIdx) {
                    cls += "border-[#5CBF2A] bg-[#EBF7E3] text-[#1a3d00] cursor-default shadow-[3px_3px_0px_#5CBF2A]";
                  } else if (idx === selected && idx !== correctIdx) {
                    cls += "border-[#E8272A] bg-[#FDECEC] text-[#5a0000] cursor-default shadow-[3px_3px_0px_#E8272A]";
                  } else {
                    cls += "border-ink/20 bg-paper text-muted cursor-default";
                  }
                  return (
                    <button key={idx} onClick={() => handleSelect(idx)} disabled={answered} className={cls}>
                      <span className="shrink-0 w-7 h-7 border-2 border-current rounded-sm flex items-center justify-center font-mono text-xs opacity-70 mt-px">{idx + 1}</span>
                      <span className="flex-1 pt-0.5">{opt}</span>
                      {answered && idx === correctIdx && (
                        <svg className="shrink-0 w-5 h-5 text-[#3a8a00] mt-0.5" fill="none" viewBox="0 0 16 16">
                          <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {answered && idx === selected && idx !== correctIdx && (
                        <svg className="shrink-0 w-5 h-5 text-[#E8272A] mt-0.5" fill="none" viewBox="0 0 16 16">
                          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {answered && (
                <div className="mx-3 sm:mx-4 mb-3 sm:mb-4 p-3 sm:p-4 border-2 border-ink/15 rounded-sm" style={{ background: "#FFFBEA" }}>
                  <p className="font-hand text-sq-red text-xs mb-1.5 uppercase tracking-wide">Explanation</p>
                  <p className="font-body text-muted text-sm leading-relaxed" style={{ lineHeight: 1.7 }}>{currentQ.explanation}</p>
                </div>
              )}

              {/* Card footer */}
              <div className="px-3 sm:px-4 pb-3 sm:pb-4 flex items-center flex-wrap gap-2 justify-between">
                {/* Keyboard hint — desktop only */}
                <p className="font-body text-xs text-muted hidden sm:block">
                  {answered
                    ? <span>Press <kbd className="font-mono border border-ink/20 rounded px-1 py-0.5 bg-surface text-xs">Enter</kbd> to continue</span>
                    : <span>Press <kbd className="font-mono border border-ink/20 rounded px-1 py-0.5 bg-surface text-xs">1</kbd>–<kbd className="font-mono border border-ink/20 rounded px-1 py-0.5 bg-surface text-xs">4</kbd> to select</span>
                  }
                </p>
                {/* On mobile, spacer keeps Next button right-aligned */}
                <span className="sm:hidden flex-1" />
                {answered && (
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 bg-sq-red text-white font-hand text-base px-5 py-2.5 border-2 border-ink rounded-sm shadow-sketch-sm hover:-translate-x-px hover:-translate-y-px hover:shadow-sketch active:translate-x-px active:translate-y-px transition-all"
                  >
                    Next
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Keyboard hint — desktop only, below card */}
        <div className="hidden sm:flex justify-center font-body text-xs text-muted pb-2">
          <kbd className="font-mono border border-ink/20 rounded px-1.5 py-0.5 bg-surface text-xs">1</kbd>
          –
          <kbd className="font-mono border border-ink/20 rounded px-1.5 py-0.5 bg-surface text-xs">4</kbd>
          {" "}select ·{" "}
          <kbd className="font-mono border border-ink/20 rounded px-1.5 py-0.5 bg-surface text-xs">Enter</kbd>
          {" "}advance
        </div>
      </div>
    </div>
  );
}
