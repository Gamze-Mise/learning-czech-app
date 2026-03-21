import { NextResponse } from "next/server";

export function jsonOk<T extends Record<string, unknown>>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

/** JSON success for Prisma payloads and other serializable values. */
export function jsonData(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

/** Client-safe `{ error }` — never expose stack traces or internals. */
export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function internalError() {
  return NextResponse.json(
    { error: "Something went wrong. Please try again later." },
    { status: 500 }
  );
}

/** Log in `catch` blocks only (server-side). */
export function logApiError(route: string, err: unknown): void {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`[api:${route}] ${msg}`, err instanceof Error ? err.stack : undefined);
}
