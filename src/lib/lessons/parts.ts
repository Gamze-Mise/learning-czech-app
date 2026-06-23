const PRONUNCIATION_GUIDE_TITLE = "pronunciation guide";

export function isPronunciationGuidePart(part: { title?: string | null }): boolean {
  const title = String(part?.title ?? "")
    .trim()
    .toLowerCase();
  return title === PRONUNCIATION_GUIDE_TITLE;
}

export function filterVisibleLessonParts<T extends { title?: string | null }>(
  parts: T[]
): T[] {
  return parts.filter((part) => !isPronunciationGuidePart(part));
}
