export interface Question {
  id: string;
  topic: string;
  subtopic: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  style: "conceptual" | "calculation" | "scenario" | "misconception" | "interpretation";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  playlist?: "statistics" | "machine-learning";
}

export interface Topic {
  slug: string;
  label: string;
  description: string;
  playlist: "statistics" | "machine-learning";
  questionCount?: number;
}

export interface QuizSession {
  topic: string | null;
  difficulty: "all" | "beginner" | "intermediate" | "advanced";
  questions: Question[];
  currentIndex: number;
  answers: Record<string, { selectedIndex: number; correct: boolean }>;
  seenIds: string[];
  score: number;
  total: number;
}

export interface TopicResult {
  topic: string;
  label: string;
  correct: number;
  total: number;
  pct: number;
}
