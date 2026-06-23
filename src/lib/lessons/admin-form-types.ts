import type { ExerciseFormState } from "@/lib/exercises/types";

export type NewPartState = {
  type: string;
  title: string;
  duration: string;
  audioUrl: string;
  videoUrl: string;
  content: string;
};

export type NewCardState = {
  frontText: string;
  backText: string;
  imageUrl: string;
  audioUrl: string;
  example: string;
  difficulty: string;
  category: string;
};

export type NewExState = ExerciseFormState;

export const EMPTY_PART: NewPartState = {
  type: "TEXT",
  title: "",
  duration: "",
  audioUrl: "",
  videoUrl: "",
  content: "",
};

export const EMPTY_CARD: NewCardState = {
  frontText: "",
  backText: "",
  imageUrl: "",
  audioUrl: "",
  example: "",
  difficulty: "1",
  category: "",
};

export const EMPTY_EXERCISE: NewExState = {
  type: "MCQ",
  question: "",
  options: "",
  answer: "",
  explanation: "",
  points: "1",
  difficulty: "1",
  timeLimit: "",
  audioUrl: "",
  imageUrl: "",
};
