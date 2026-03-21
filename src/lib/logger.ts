/** Dev-only log (server or client). */
export function devLog(...args: unknown[]): void {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
}

/**
 * Development-only logging for client components.
 * Production builds omit noise; errors can still be surfaced in UI state.
 */
export function devWarn(...args: unknown[]): void {
  if (process.env.NODE_ENV === "development") {
    console.warn(...args);
  }
}

export function devError(...args: unknown[]): void {
  if (process.env.NODE_ENV === "development") {
    console.error(...args);
  }
}
