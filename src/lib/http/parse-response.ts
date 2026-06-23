/** Extract a user-facing message from a non-JSON or error response body. */
export function messageFromResponseBody(text: string, status?: number): string {
  const t = text.trim();
  if (!t) return status != null ? `Request failed (${status})` : "Upload failed";
  try {
    const j = JSON.parse(t) as { error?: string };
    if (typeof j.error === "string" && j.error.trim()) return j.error.trim();
  } catch {
    /* plain text or HTML */
  }
  return t.slice(0, status != null ? 280 : 200);
}
