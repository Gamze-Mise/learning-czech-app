"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type Entry = { href: string; title: string; hint: string; keywords?: string };

const ENTRIES: Entry[] = [
  { href: "/admin", title: "Overview", hint: "Dashboard", keywords: "home stats" },
  { href: "/admin/courses", title: "Courses", hint: "List & edit courses", keywords: "program syllabus" },
  { href: "/admin/courses/new", title: "New course", hint: "Create course", keywords: "add" },
  { href: "/admin/units", title: "Units", hint: "All units", keywords: "module chapter" },
  { href: "/admin/units/new", title: "New unit", hint: "Create unit", keywords: "add" },
  { href: "/admin/lessons", title: "Lessons", hint: "All lessons", keywords: "session content" },
  { href: "/admin/lessons/new", title: "New lesson", hint: "Create lesson", keywords: "add" },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AdminCommandPalette({ open, onClose }: Props) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    setQ("");
    onClose();
  }, [onClose]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return ENTRIES;
    return ENTRIES.filter((e) => {
      const blob = `${e.title} ${e.hint} ${e.keywords ?? ""}`.toLowerCase();
      return blob.includes(s);
    });
  }, [q]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 10);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, handleClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-900/50 p-4 pt-[12vh] backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Quick navigation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5">
        <div className="border-b border-slate-100 px-3 py-2">
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search pages…"
            className="w-full rounded-xl border border-transparent bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white"
          />
        </div>
        <ul className="max-h-[min(60vh,420px)] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-slate-500">No matches</li>
          ) : (
            filtered.map((e) => (
              <li key={e.href}>
                <Link
                  href={e.href}
                  onClick={() => handleClose()}
                  className="flex flex-col gap-0.5 px-4 py-2.5 text-left transition hover:bg-indigo-50"
                >
                  <span className="text-sm font-semibold text-slate-900">{e.title}</span>
                  <span className="text-xs text-slate-500">{e.hint}</span>
                </Link>
              </li>
            ))
          )}
        </ul>
        <div className="border-t border-slate-100 px-4 py-2 text-[11px] text-slate-500">
          <span>Tip: press ⌘K (Ctrl+K) to toggle this panel</span>
        </div>
      </div>
    </div>
  );
}
