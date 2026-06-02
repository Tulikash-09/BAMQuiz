"use client";

import Link from "next/link";
import { useState } from "react";
import { STATS_TOPICS, ML_TOPICS } from "@/lib/topics";
import HamburgerNav from "@/components/HamburgerNav";

const STATS_PLAYLIST_URL = "https://youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9";
const ML_PLAYLIST_URL = "https://youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF&si=CdESghUKKlNPk6Dh";

const STATS_COUNTS: Record<string, number> = {
  "histograms-distributions": 294, "mean-median-mode": 292, "variance-standard-deviation": 290,
  "normal-distribution": 272, "probability": 272, "hypothesis-testing": 274,
  "p-values-significance": 275, "confidence-intervals": 276, "t-tests": 275,
  "anova": 258, "linear-regression": 259, "correlation": 257,
  "bayesian-statistics": 259, "central-limit-theorem": 258, "chi-square-tests": 257,
  "logistic-regression": 255, "sensitivity-specificity": 252, "bootstrapping": 259,
  "multiple-testing": 259, "covariance-correlation": 252,
};

const ML_COUNTS: Record<string, number> = {
  "decision-trees": 375, "random-forests": 375, "gradient-boosting": 375,
  "xgboost": 375, "support-vector-machines": 375, "neural-networks-basics": 375,
  "backpropagation": 375, "pca-dimensionality-reduction": 375,
  "clustering-kmeans-hierarchical": 375, "cross-validation": 375,
  "bias-variance-tradeoff": 375, "regularisation-l1-l2": 375,
  "logistic-regression-ml": 375, "naive-bayes": 375, "k-nearest-neighbours": 375,
  "ensemble-methods": 375, "loss-functions": 375, "overfitting-underfitting": 375,
  "feature-engineering": 375, "model-evaluation-metrics": 375,
};

function WavyDivider() {
  return (
    <div className="overflow-hidden py-1 px-5 sm:px-8 max-w-5xl mx-auto">
      <svg viewBox="0 0 1200 16" preserveAspectRatio="none" className="w-full h-4" aria-hidden="true">
        <path
          d="M0,8 Q150,2 300,8 Q450,14 600,8 Q750,2 900,8 Q1050,14 1200,8"
          fill="none"
          stroke="#1A1A2E"
          strokeOpacity="0.18"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

function ScatterDoodle() {
  return (
    <svg width="130" height="110" viewBox="0 0 130 110" aria-hidden="true">
      <line x1="10" y1="95" x2="120" y2="95" stroke="#1A1A2E" strokeOpacity="0.15" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="10" x2="10" y2="95" stroke="#1A1A2E" strokeOpacity="0.15" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="22" cy="82" r="3" fill="#1A1A2E" fillOpacity="0.15" />
      <circle cx="38" cy="68" r="3" fill="#1A1A2E" fillOpacity="0.15" />
      <circle cx="48" cy="72" r="3" fill="#1A1A2E" fillOpacity="0.15" />
      <circle cx="58" cy="55" r="3" fill="#1A1A2E" fillOpacity="0.15" />
      <circle cx="52" cy="60" r="3" fill="#1A1A2E" fillOpacity="0.15" />
      <circle cx="72" cy="42" r="3" fill="#1A1A2E" fillOpacity="0.15" />
      <circle cx="85" cy="32" r="3" fill="#1A1A2E" fillOpacity="0.15" />
      <circle cx="95" cy="28" r="3" fill="#1A1A2E" fillOpacity="0.15" />
      <circle cx="78" cy="38" r="3" fill="#1A1A2E" fillOpacity="0.15" />
      <circle cx="62" cy="50" r="3" fill="#1A1A2E" fillOpacity="0.15" />
      <line x1="15" y1="88" x2="115" y2="22" stroke="#1A1A2E" strokeOpacity="0.10" strokeWidth="1" strokeDasharray="4,3" />
    </svg>
  );
}

function BellCurveDoodle() {
  return (
    <svg width="130" height="90" viewBox="0 0 130 90" aria-hidden="true">
      <path
        d="M5,72 C20,72 30,70 40,55 C50,40 55,12 65,10 C75,12 80,40 90,55 C100,70 110,72 125,72"
        fill="none"
        stroke="#1A1A2E"
        strokeOpacity="0.15"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line x1="5" y1="72" x2="125" y2="72" stroke="#1A1A2E" strokeOpacity="0.15" strokeWidth="1" strokeLinecap="round" />
      <line x1="65" y1="72" x2="65" y2="12" stroke="#1A1A2E" strokeOpacity="0.10" strokeWidth="1" strokeDasharray="3,3" />
      <text x="59" y="83" fontSize="9" fill="#1A1A2E" fillOpacity="0.20" fontFamily="serif">μ</text>
    </svg>
  );
}

function TreeDoodle() {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" aria-hidden="true">
      <rect x="32" y="4" width="36" height="20" rx="2" fill="none" stroke="#1A1A2E" strokeOpacity="0.15" strokeWidth="1.5" />
      <line x1="50" y1="24" x2="22" y2="46" stroke="#1A1A2E" strokeOpacity="0.15" strokeWidth="1" />
      <line x1="50" y1="24" x2="78" y2="46" stroke="#1A1A2E" strokeOpacity="0.15" strokeWidth="1" />
      <rect x="6" y="46" width="32" height="20" rx="2" fill="none" stroke="#1A1A2E" strokeOpacity="0.15" strokeWidth="1.5" />
      <rect x="62" y="46" width="32" height="20" rx="2" fill="none" stroke="#1A1A2E" strokeOpacity="0.15" strokeWidth="1.5" />
      <line x1="22" y1="66" x2="14" y2="84" stroke="#1A1A2E" strokeOpacity="0.15" strokeWidth="1" />
      <line x1="22" y1="66" x2="32" y2="84" stroke="#1A1A2E" strokeOpacity="0.15" strokeWidth="1" />
      <line x1="78" y1="66" x2="68" y2="84" stroke="#1A1A2E" strokeOpacity="0.15" strokeWidth="1" />
      <line x1="78" y1="66" x2="88" y2="84" stroke="#1A1A2E" strokeOpacity="0.15" strokeWidth="1" />
      <circle cx="14" cy="89" r="5" fill="none" stroke="#1A1A2E" strokeOpacity="0.15" strokeWidth="1.5" />
      <circle cx="32" cy="89" r="5" fill="none" stroke="#1A1A2E" strokeOpacity="0.15" strokeWidth="1.5" />
      <circle cx="68" cy="89" r="5" fill="none" stroke="#1A1A2E" strokeOpacity="0.15" strokeWidth="1.5" />
      <circle cx="88" cy="89" r="5" fill="none" stroke="#1A1A2E" strokeOpacity="0.15" strokeWidth="1.5" />
    </svg>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"statistics" | "machine-learning">("statistics");

  const topicList = activeTab === "statistics" ? STATS_TOPICS : ML_TOPICS;
  const countMap = activeTab === "statistics" ? STATS_COUNTS : ML_COUNTS;
  const playlistParam = activeTab === "statistics" ? "statistics" : "machine-learning";

  return (
    <div className="min-h-screen bg-paper notebook-lines">
      <HamburgerNav />

      {/* ── Hero ── */}
      <section className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-10 sm:pb-16 text-center overflow-hidden">
        {/* Decorative doodles */}
        <div className="absolute left-2 top-16 opacity-90 hidden sm:block pointer-events-none select-none">
          <ScatterDoodle />
        </div>
        <div className="absolute right-2 top-12 opacity-90 hidden sm:block pointer-events-none select-none">
          <BellCurveDoodle />
        </div>
        <div className="absolute right-10 bottom-4 opacity-70 hidden lg:block pointer-events-none select-none">
          <TreeDoodle />
        </div>

        {/* Fan-made badge */}
        <div className="inline-flex items-center gap-2 border-2 border-ink/20 rounded-sm px-4 py-1.5 text-xs font-body text-muted mb-7 sm:mb-10 bg-white" style={{ boxShadow: "2px 2px 0px rgba(26,26,46,0.08)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-sq-red inline-block" />
          Fan-made study tool · Free forever
        </div>

        <h1 className="leading-none mb-5 text-balance relative z-10">
          <span
            className="font-hand text-sq-red block"
            style={{ fontSize: "clamp(56px, 13vw, 96px)", lineHeight: 1 }}
          >
            BAM!
          </span>
          <span
            className="font-hand text-ink block mt-2"
            style={{ fontSize: "clamp(32px, 7vw, 60px)" }}
          >
            Quiz
          </span>
        </h1>

        <p className="font-body text-muted text-lg sm:text-xl max-w-xl mx-auto mb-2 leading-relaxed relative z-10">
          Statistics &amp; Machine Learning, one BAM at a time.
        </p>
        <p className="font-body text-muted/70 text-sm max-w-lg mx-auto mb-10 relative z-10">
          Based on Josh Starmer&apos;s StatQuest YouTube playlists — the best free ML and stats education on the internet.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 relative z-10 w-full max-w-sm sm:max-w-none mx-auto">
          <Link
            href="/quiz?playlist=statistics"
            className="inline-flex items-center justify-center gap-2 bg-sq-red text-white font-hand text-base px-7 py-3.5 sm:py-3 border-2 border-ink rounded-sm shadow-sketch hover:-translate-x-px hover:-translate-y-px hover:shadow-sketch-hover active:translate-x-px active:translate-y-px active:shadow-none transition-all"
          >
            Practice Statistics
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link
            href="/quiz?playlist=machine-learning"
            className="inline-flex items-center justify-center gap-2 bg-white text-ink font-hand text-base px-7 py-3.5 sm:py-3 border-2 border-ink rounded-sm shadow-sketch hover:-translate-x-px hover:-translate-y-px hover:shadow-sketch-hover active:translate-x-px active:translate-y-px active:shadow-none transition-all"
          >
            Practice ML
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      <WavyDivider />

      {/*
        FUTURE SCOPE: Playlist cards section commented out to avoid redundancy with hero CTAs.
        Potential future use: user profiles, timed quiz leaderboard, or playlist-specific progress tracking.
        See GitHub issue #XX when re-implementing.
        Note: preserved via {false && ()} rather than a JSX block comment to avoid nested comment conflicts.
      */}
      {false && (
        <>
          {/* ── Playlist cards ── */}
          <section className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Stats card */}
              <div className="border-2 border-ink bg-white rounded-sm p-7 flex flex-col gap-5 shadow-sketch hover:-translate-x-px hover:-translate-y-px hover:shadow-sketch-hover transition-all">
                <div>
                  <div className="text-xs font-body text-muted mb-2 uppercase tracking-widest">Statistics Fundamentals</div>
                  <h2 className="font-hand text-4xl text-ink">Statistics</h2>
                  <p className="font-body text-muted text-sm mt-1">Fundamentals</p>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-body text-muted">
                  <span>62 videos</span>
                  <span>·</span>
                  <span>20 topics</span>
                  <span>·</span>
                  <span>5,345 questions</span>
                </div>
                <Link
                  href="/quiz?playlist=statistics"
                  className="mt-auto inline-flex items-center gap-2 bg-sq-red text-white font-hand text-base px-5 py-2.5 border-2 border-ink rounded-sm shadow-sketch-sm hover:-translate-x-px hover:-translate-y-px hover:shadow-sketch transition-all w-fit"
                >
                  Start Practicing
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>

              {/* ML card */}
              <div className="border-2 border-ink bg-white rounded-sm p-7 flex flex-col gap-5 shadow-sketch hover:-translate-x-px hover:-translate-y-px hover:shadow-sketch-hover transition-all">
                <div>
                  <div className="text-xs font-body text-muted mb-2 uppercase tracking-widest">StatQuest ML Playlist</div>
                  <h2 className="font-hand text-4xl text-ink">Machine</h2>
                  <p className="font-body text-muted text-sm mt-1">Learning</p>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-body text-muted">
                  <span>106 videos</span>
                  <span>·</span>
                  <span>30 topics</span>
                  <span>·</span>
                  <span>7,500+ questions</span>
                </div>
                <Link
                  href="/quiz?playlist=machine-learning"
                  className="mt-auto inline-flex items-center gap-2 bg-white text-ink font-hand text-base px-5 py-2.5 border-2 border-ink rounded-sm shadow-sketch-sm hover:-translate-x-px hover:-translate-y-px hover:shadow-sketch transition-all w-fit"
                >
                  Start Practicing
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── Stats bar ── */}
      <section className="bg-ink">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-center">
            {[
              ["12,600+", "questions"],
              ["50", "topics"],
              ["3", "difficulty levels"],
              ["Free", "forever"],
            ].map(([val, lbl]) => (
              <div key={lbl} className="flex items-baseline gap-2">
                <span className="font-hand text-3xl text-sq-red">{val}</span>
                <span className="font-body text-white/70 text-sm">{lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Topic explorer ── */}
      <section id="topics" className="max-w-5xl mx-auto px-5 sm:px-8 py-14">
        <div className="flex items-baseline justify-between mb-7">
          <h2 className="font-hand text-4xl text-ink">Topic Explorer</h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {(["statistics", "machine-learning"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 font-hand text-base border-2 border-ink rounded-sm shadow-sketch-sm hover:-translate-x-px hover:-translate-y-px hover:shadow-sketch transition-all ${
                activeTab === tab
                  ? "bg-sq-red text-white"
                  : "bg-white text-ink"
              }`}
            >
              {tab === "statistics" ? "Statistics" : "Machine Learning"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {topicList.map((topic) => (
            <Link
              key={topic.slug}
              href={`/quiz?playlist=${playlistParam}&topic=${topic.slug}`}
              className="group border-2 border-ink bg-white rounded-sm p-4 shadow-sketch-sm hover:-translate-x-px hover:-translate-y-px hover:shadow-sketch transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-hand text-ink text-base leading-snug group-hover:text-sq-red transition-colors">
                  {topic.label}
                </h3>
                <span className="font-mono text-muted text-xs shrink-0 mt-0.5">
                  {countMap[topic.slug] ?? "—"}
                </span>
              </div>
              <p className="font-body text-muted text-xs mt-1.5 leading-relaxed line-clamp-2">
                {topic.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <WavyDivider />

      {/* ── About ── */}
      <section id="about" className="max-w-5xl mx-auto px-5 sm:px-8 py-14">
        <div className="max-w-2xl border-2 border-ink rounded-sm p-5 sm:p-8 shadow-sketch" style={{ background: "#FFFBEA" }}>
          <h2 className="font-hand text-4xl text-ink mb-4">About BAM! Quiz</h2>
          <p className="font-body text-muted leading-relaxed mb-5">
            BAM! Quiz is a free, fan-made study tool built around Josh Starmer&apos;s StatQuest YouTube channel —
            hands down the clearest explanation of statistics and machine learning on the internet.
            If you find this useful, go subscribe to StatQuest and consider supporting Josh directly.
          </p>
          <p className="font-body text-muted text-sm leading-relaxed mb-8">
            This project is not affiliated with Josh Starmer or StatQuest. All question content is original,
            inspired by the concepts taught across his playlists.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.youtube.com/@statquest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-sq-red text-white font-hand text-base px-5 py-2.5 border-2 border-ink rounded-sm shadow-sketch-sm hover:-translate-x-px hover:-translate-y-px hover:shadow-sketch transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              StatQuest YouTube
            </a>
            <a
              href={STATS_PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-ink font-hand text-base px-5 py-2.5 border-2 border-ink rounded-sm shadow-sketch-sm hover:-translate-x-px hover:-translate-y-px hover:shadow-sketch transition-all"
            >
              Statistics Playlist
            </a>
            <a
              href={ML_PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-ink font-hand text-base px-5 py-2.5 border-2 border-ink rounded-sm shadow-sketch-sm hover:-translate-x-px hover:-translate-y-px hover:shadow-sketch transition-all"
            >
              ML Playlist
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t-2 border-ink/10 mt-4">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-between text-xs font-body text-muted">
          <span className="font-hand text-sm text-ink/50">BAM! Quiz — fan-made, free forever</span>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <a href={STATS_PLAYLIST_URL} target="_blank" rel="noopener noreferrer" className="hover:text-sq-red transition-colors">Statistics Playlist</a>
            <a href={ML_PLAYLIST_URL} target="_blank" rel="noopener noreferrer" className="hover:text-sq-red transition-colors">ML Playlist</a>
            <a href="https://www.youtube.com/@statquest" target="_blank" rel="noopener noreferrer" className="hover:text-sq-red transition-colors">@statquest</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
