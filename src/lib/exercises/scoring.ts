import { getEffectiveExerciseType, isAnswerAcceptable } from "./runtime";
import type { ExerciseAnswerState, ExerciseForScoring } from "./types";

export function computeExerciseCorrect(
  exercise: ExerciseForScoring,
  state: ExerciseAnswerState
): { correct: boolean; correctAnswer: string } {
  const effectiveType = getEffectiveExerciseType(exercise.type);

  if (effectiveType === "MCQ") {
    const correctOption = (exercise.options ?? []).find((opt) => opt.correct === true);
    const correctAnswer = correctOption?.text || exercise.answer || "";
    return { correct: state.selectedAnswer === correctAnswer, correctAnswer };
  }

  if (effectiveType === "FILL") {
    const correctAnswer = exercise.answer || "";
    return {
      correct: isAnswerAcceptable(state.userAnswer, correctAnswer),
      correctAnswer,
    };
  }

  if (effectiveType === "MATCHING") {
    const correctPairs = (exercise.options ?? []).length;
    const userPairs = Object.keys(state.matchingPairs).length;
    if (userPairs !== correctPairs) {
      return {
        correct: false,
        correctAnswer: `Match all ${correctPairs} pairs`,
      };
    }
    const correct = (exercise.options ?? []).every(
      (opt) => state.matchingPairs[opt.left ?? ""] === opt.right
    );
    return { correct, correctAnswer: `${correctPairs} pairs` };
  }

  return { correct: false, correctAnswer: String(exercise.answer ?? "") };
}

export function serializeExerciseAnswer(
  exercise: ExerciseForScoring,
  state: ExerciseAnswerState
): string {
  const effectiveType = getEffectiveExerciseType(exercise.type);
  if (effectiveType === "FILL") return state.userAnswer;
  if (effectiveType === "MATCHING") return JSON.stringify(state.matchingPairs);
  return state.selectedAnswer;
}
