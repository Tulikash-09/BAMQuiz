import type { Metadata } from "next";
import { Suspense } from "react";
import QuizClient from "./QuizClient";

export const metadata: Metadata = {
  title: "Quiz — StatQuest Quiz",
  description: "Practice statistics with questions based on Josh Starmer's StatQuest playlist.",
};

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-paper flex items-center justify-center font-hand text-muted text-xl">
        Loading…
      </div>
    }>
      <QuizClient />
    </Suspense>
  );
}
