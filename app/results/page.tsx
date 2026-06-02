import type { Metadata } from "next";
import { Suspense } from "react";
import ResultsClient from "./ResultsClient";

export const metadata: Metadata = {
  title: "Results — BAM! Quiz",
  description: "See your quiz results and topic breakdown.",
};

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-paper flex items-center justify-center font-hand text-muted text-xl">
        Loading…
      </div>
    }>
      <ResultsClient />
    </Suspense>
  );
}
