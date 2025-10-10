// SRS (Spaced Repetition System) helper functions
// Leitner box system implementation

export function intervalDaysForBox(box: number): number {
  switch (box) {
    case 1:
      return 0; // Same day
    case 2:
      return 1; // 1 day
    case 3:
      return 3; // 3 days
    case 4:
      return 7; // 1 week
    case 5:
      return 14; // 2 weeks
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
  nextDue: Date;
}

export function processFlashcardReview(
  currentBox: number,
  currentCorrectCount: number,
  currentWrongCount: number,
  result: "known" | "unknown"
): FlashcardReviewResult {
  let newBox = currentBox;
  let correctCount = currentCorrectCount;
  let wrongCount = currentWrongCount;

  if (result === "known") {
    newBox = Math.min(currentBox + 1, 5);
    correctCount = currentCorrectCount + 1;
  } else {
    newBox = Math.max(currentBox - 1, 1);
    wrongCount = currentWrongCount + 1;
  }

  return {
    newBox,
    correctCount,
    wrongCount,
    nextDue: calculateNextDue(newBox),
  };
}
