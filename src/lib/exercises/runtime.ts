export function getEffectiveExerciseType(type: string): string {
  if (type === "LISTENING") return "MCQ";
  if (type === "TRANSLATION") return "FILL";
  return type;
}

export function normalizeAnswerText(text: string): string {
  return String(text ?? "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "");
}

export function isAnswerAcceptable(userText: string, correctText: string): boolean {
  const normalizedUser = normalizeAnswerText(userText);
  const normalizedCorrect = normalizeAnswerText(correctText);
  if (normalizedUser === normalizedCorrect) return true;
  const variations = [
    normalizedCorrect.replace(/\s+/g, ""),
    normalizedCorrect.replace(/\s+/g, " "),
  ];
  return variations.some((v) => normalizedUser === v);
}
