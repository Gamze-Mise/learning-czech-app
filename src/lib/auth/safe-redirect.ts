export function safeRedirect(raw: string | null, fallback: string): string {
  if (!raw || !raw.startsWith("/")) return fallback;
  return raw;
}
