"use client";

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center bg-slate-100 px-6 font-sans text-slate-900 antialiased">
        <h1 className="text-xl font-semibold">Application error</h1>
        <p className="mt-2 max-w-sm text-center text-sm text-slate-600">
          A critical error occurred. Please refresh the page or try again later.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
