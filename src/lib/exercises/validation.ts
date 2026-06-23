import type { ExerciseType } from "@prisma/client";

function isMcqLike(type: ExerciseType): boolean {
  return type === "MCQ" || type === "LISTENING";
}

function isFillLike(type: ExerciseType): boolean {
  return type === "FILL" || type === "TRANSLATION";
}

export function validateExercise(
  type: ExerciseType,
  answer: string | null,
  options: unknown
): string | null {
  if (isFillLike(type)) {
    if (!answer || !answer.trim()) {
      return "Answer is required for this exercise type.";
    }
  }

  if (isMcqLike(type)) {
    if (!Array.isArray(options) || options.length < 2) {
      return "MCQ/LISTENING requires at least 2 options.";
    }
    const correctCount = options.filter(
      (o: unknown) =>
        o !== null &&
        typeof o === "object" &&
        "correct" in o &&
        (o as { correct?: boolean }).correct === true
    ).length;
    if (correctCount !== 1) {
      return "MCQ/LISTENING requires exactly 1 correct option.";
    }
  }

  if (type === "MATCHING") {
    if (!Array.isArray(options) || options.length < 1) {
      return "MATCHING requires at least 1 pair.";
    }
    const ok = options.every(
      (o: unknown) =>
        o !== null &&
        typeof o === "object" &&
        "left" in o &&
        "right" in o &&
        typeof (o as { left: unknown }).left === "string" &&
        typeof (o as { right: unknown }).right === "string" &&
        (o as { left: string }).left.trim().length > 0 &&
        (o as { right: string }).right.trim().length > 0
    );
    if (!ok) {
      return "MATCHING options must be an array of { left, right } with non-empty strings.";
    }
  }

  return null;
}
