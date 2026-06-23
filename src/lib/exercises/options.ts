import type { MatchingOption, McqOption } from "./types";

export function safeJsonParse(text: string): unknown {
  const t = String(text ?? "").trim();
  if (!t) return null;
  try {
    return JSON.parse(t);
  } catch {
    return null;
  }
}

export function normalizeMcq(raw: unknown): McqOption[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((o: unknown) => {
      if (typeof o === "string") return { text: o, correct: false };
      if (o && typeof o === "object" && "text" in o) {
        const row = o as { text?: unknown; correct?: unknown };
        return {
          text: typeof row.text === "string" ? row.text : "",
          correct: Boolean(row.correct),
        };
      }
      return { text: "", correct: false };
    })
    .filter((o) => o.text.trim().length > 0);
}

export function normalizeMatching(raw: unknown): MatchingOption[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((o: unknown) => {
      if (o && typeof o === "object" && "left" in o && "right" in o) {
        const row = o as { left?: unknown; right?: unknown };
        return {
          left: typeof row.left === "string" ? row.left : "",
          right: typeof row.right === "string" ? row.right : "",
        };
      }
      return { left: "", right: "" };
    })
    .filter((o) => o.left.trim().length > 0 || o.right.trim().length > 0);
}

export function toJsonString(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export function setSingleCorrect(options: McqOption[], idx: number): McqOption[] {
  return options.map((o, i) => ({ ...o, correct: i === idx }));
}

export function parseOptionsFromBody(
  raw: unknown
): { options: unknown | null; error?: string } {
  if (raw == null || !String(raw).trim()) return { options: null };
  try {
    return { options: JSON.parse(String(raw)) };
  } catch {
    return { options: null, error: "options must be valid JSON" };
  }
}
