import {
  normalizeMatching,
  normalizeMcq,
  safeJsonParse,
  setSingleCorrect,
  toJsonString,
} from "./options";

export function needsMcqOptions(type: string): boolean {
  return type === "MCQ" || type === "LISTENING";
}

export function needsFillAnswer(type: string): boolean {
  return type === "FILL" || type === "TRANSLATION";
}

export function needsMatchingOptions(type: string): boolean {
  return type === "MATCHING";
}

export function allowExerciseAudio(type: string): boolean {
  return type === "LISTENING";
}

export function allowExerciseTimeLimit(type: string): boolean {
  return type !== "MATCHING";
}

export function defaultOptionsFor(type: string): string {
  if (needsMcqOptions(type)) {
    return toJsonString([
      { text: "Option A", correct: true },
      { text: "Option B", correct: false },
    ]);
  }
  if (needsMatchingOptions(type)) {
    return toJsonString([{ left: "TODO", right: "TODO" }]);
  }
  return "";
}

export function applyExerciseTypeChange<T extends {
  type: string;
  options: string;
  answer: string;
  audioUrl: string;
  timeLimit: string;
}>(prev: T, nextType: string): T {
  const next = { ...prev, type: nextType };

  if (
    (needsMcqOptions(nextType) || needsMatchingOptions(nextType)) &&
    !String(prev.options ?? "").trim()
  ) {
    next.options = defaultOptionsFor(nextType);
  }
  if (!needsFillAnswer(nextType)) {
    next.answer = "";
  }
  if (!allowExerciseAudio(nextType)) {
    next.audioUrl = "";
  }
  if (!allowExerciseTimeLimit(nextType)) {
    next.timeLimit = "";
  }

  return next;
}

export function findExerciseIssues(
  type: string,
  answer: string,
  optionsText: string
): string[] {
  const issues: string[] = [];
  const parsed = safeJsonParse(optionsText);

  if (needsFillAnswer(type) && !String(answer ?? "").trim()) {
    issues.push("Answer is required for this type.");
  }

  if (needsMcqOptions(type)) {
    const opts = normalizeMcq(parsed);
    if (opts.length < 2) issues.push("At least 2 choices are required.");
    const correctCount = opts.filter((o) => o.correct).length;
    if (correctCount !== 1) issues.push("Exactly 1 choice must be marked correct.");
  }

  if (needsMatchingOptions(type)) {
    const pairs = normalizeMatching(parsed);
    if (pairs.length < 1) issues.push("At least 1 pair is required.");
    const invalid = pairs.some(
      (p) => !String(p.left).trim() || !String(p.right).trim()
    );
    if (invalid) {
      issues.push("Each pair must have non-empty left and right values.");
    }
  }

  return issues;
}

export function autoFixExercise(
  type: string,
  answer: string,
  optionsText: string
): { answer: string; options: string } {
  const parsed = safeJsonParse(optionsText);

  if (needsMcqOptions(type)) {
    let opts = normalizeMcq(parsed);
    if (opts.length < 2) {
      opts = [
        { text: opts[0]?.text?.trim() ? opts[0].text : "Option A", correct: true },
        { text: "Option B", correct: false },
      ];
    }
    const firstCorrect = opts.findIndex((o) => o.correct);
    const idx = firstCorrect >= 0 ? firstCorrect : 0;
    opts = setSingleCorrect(opts, idx);
    return { answer: "", options: toJsonString(opts) };
  }

  if (needsMatchingOptions(type)) {
    let pairs = normalizeMatching(parsed);
    if (pairs.length < 1) pairs = [{ left: "TODO", right: "TODO" }];
    pairs = pairs.map((p) => ({
      left: String(p.left ?? "").trim() ? p.left : "TODO",
      right: String(p.right ?? "").trim() ? p.right : "TODO",
    }));
    return { answer: "", options: toJsonString(pairs) };
  }

  if (needsFillAnswer(type)) {
    const a = String(answer ?? "").trim() ? answer : "TODO";
    return { answer: a, options: "" };
  }

  return { answer: "", options: "" };
}
