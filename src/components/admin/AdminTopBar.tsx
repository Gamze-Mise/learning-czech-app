"use client";

type Props = {
  onOpenSearch: () => void;
};

export default function AdminTopBar({ onOpenSearch }: Props) {
  return (
    <div className="sticky top-0 z-40 -mx-4 mb-6 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Admin
          </p>
          <p className="truncate text-sm text-slate-600">Search and jump to any screen</p>
        </div>
        <button
          type="button"
          onClick={onOpenSearch}
          className="inline-flex w-full max-w-md flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-500 shadow-sm transition hover:border-indigo-200 hover:bg-white sm:w-auto"
        >
          <svg
            className="h-4 w-4 shrink-0 text-slate-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 1 0 3.23 9.97l3.68 3.68a.75.75 0 1 0 1.06-1.06l-3.68-3.68A5.5 5.5 0 0 0 9 3.5ZM4.5 9a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0Z"
              clipRule="evenodd"
            />
          </svg>
          <span className="flex-1 truncate">Search pages…</span>
          <kbd className="hidden shrink-0 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-500 sm:inline">
            ⌘K
          </kbd>
        </button>
      </div>
    </div>
  );
}
