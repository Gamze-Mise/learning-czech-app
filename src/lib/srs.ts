export function intervalDaysForBox(box: number): number {
  switch (box) {
    case 1:
      return 0;
    case 2:
      return 1;
    case 3:
      return 3;
    case 4:
      return 7;
    case 5:
      return 14;
    default:
      return 1;
  }
}

export function calculateNextDue(box: number): Date {
  const nextDue = new Date();
  nextDue.setDate(nextDue.getDate() + intervalDaysForBox(box));
  return nextDue;
}

export interface FlashcardReviewResult {
  newBox: number;
  correctCount: number;
  wrongCount: number;
  streak: number;
  nextDue: Date;
  isMastered: boolean;
  xpEarned: number;
}

export function processFlashcardReview(
  currentBox: number,
  currentCorrectCount: number,
  currentWrongCount: number,
  currentStreak: number,
  result: "known" | "unknown",
  studyTimeSeconds?: number
): FlashcardReviewResult {
  let newBox = currentBox;
  let correctCount = currentCorrectCount;
  let wrongCount = currentWrongCount;
  let streak = currentStreak;
  let xpEarned = 0;

  if (result === "known") {
    newBox = Math.min(currentBox + 1, 5);
    correctCount = currentCorrectCount + 1;
    streak = currentStreak + 1;

    xpEarned = newBox * 2 + (streak > 3 ? streak : 0);
  } else {
    newBox = Math.max(currentBox - 1, 1);
    wrongCount = currentWrongCount + 1;
    streak = 0;
    xpEarned = 1;
  }

  const isMastered = newBox === 5 && streak >= 5;

  return {
    newBox,
    correctCount,
    wrongCount,
    streak,
    nextDue: calculateNextDue(newBox),
    isMastered,
    xpEarned,
  };
}

export function calculateMasteryPercentage(
  correctCount: number,
  wrongCount: number
): number {
  const total = correctCount + wrongCount;
  if (total === 0) return 0;
  return Math.round((correctCount / total) * 100);
}

// Get flashcards due for review
export function getDueFlashcards(
  flashcardProgresses: {
    id: number;
    nextDue: Date | null;
    box: number;
    isMastered: boolean;
  }[]
): {
  id: number;
  nextDue: Date | null;
  box: number;
  isMastered: boolean;
}[] {
  const now = new Date();
  return flashcardProgresses.filter(
    (progress) =>
      !progress.isMastered &&
      (progress.nextDue === null || progress.nextDue <= now)
  );
}

export function calculateSessionStats(
  results: { correct: boolean; xpEarned: number; timeSpent: number }[]
) {
  const totalAnswers = results.length;
  const correctAnswers = results.filter((r) => r.correct).length;
  const totalXP = results.reduce((sum, r) => sum + r.xpEarned, 0);
  const totalTime = results.reduce((sum, r) => sum + r.timeSpent, 0);
  const accuracy = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0;

  return {
    totalAnswers,
    correctAnswers,
    totalXP,
    totalTime,
    accuracy: Math.round(accuracy),
  };
}

export function getStudyRecommendation(
  dueCount: number,
  masteredCount: number,
  totalCount: number
): {
  type: "review" | "new" | "mastered";
  message: string;
  priority: "high" | "medium" | "low";
} {
  if (dueCount > 0) {
    return {
      type: "review",
      message: `${dueCount} card(s) are due for review!`,
      priority: dueCount > 10 ? "high" : "medium",
    };
  }

  if (masteredCount === totalCount) {
    return {
      type: "mastered",
      message: "Congratulations! You’ve completed this lesson! 🎉",
      priority: "low",
    };
  }

  return {
    type: "new",
    message: "You’re ready to learn new cards!",
    priority: "medium",
  };
}
