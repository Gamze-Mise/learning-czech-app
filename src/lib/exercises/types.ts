export const EXERCISE_TYPES = [
  "MCQ",
  "FILL",
  "MATCHING",
  "LISTENING",
  "TRANSLATION",
] as const;

export type ExerciseTypeName = (typeof EXERCISE_TYPES)[number];

export type McqOption = { text: string; correct?: boolean };
export type MatchingOption = { left: string; right: string };

export type ExerciseFormState = {
  type: string;
  question: string;
  options: string;
  answer: string;
  explanation: string;
  points: string;
  difficulty: string;
  timeLimit: string;
  audioUrl: string;
  imageUrl: string;
  isActive?: boolean;
  order?: string | number;
};

export type ExerciseForScoring = {
  type: string;
  options?: Array<{
    text?: string;
    correct?: boolean;
    left?: string;
    right?: string;
  }> | null;
  answer?: string | null;
};

export type ExerciseAnswerState = {
  selectedAnswer: string;
  userAnswer: string;
  matchingPairs: Record<string, string>;
};
