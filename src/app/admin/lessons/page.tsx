"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminPageHeader, {
  adminPrimaryButtonClass,
} from "@/components/admin/AdminPageHeader";

type LessonRow = {
  id: number;
  title: string;
  order: number;
  type: string;
  isActive: boolean;
  unit: { id: number; title: string; course: { title: string | null } };
  _count: { exercises: number; flashcards: number; parts: number };
};

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/lessons")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((d) => setLessons(d.lessons ?? []))
      .catch(() => setError("Could not load lessons"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Lessons"
        description="Create and edit lessons per unit. Deactivated lessons stay hidden in the app."
        action={
          <Link href="/admin/lessons/new" className={adminPrimaryButtonClass}>
            + New lesson
          </Link>
        }
      />

      {loading && (
        <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
          <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
        </div>
      )}
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/90 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3.5">Lesson</th>
                  <th className="px-4 py-3.5">Unit / Course</th>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5 text-center">Parts</th>
                  <th className="px-4 py-3.5 text-center">Cards</th>
                  <th className="px-4 py-3.5 text-center">Ex.</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {lessons.map((l) => (
                  <tr
                    key={l.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50/80"
                  >
                    <td className="px-4 py-3.5 font-medium text-slate-900">
                      <span className="mr-2 tabular-nums text-slate-400">
                        {l.order}.
                      </span>
                      {l.title}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">
                      {l.unit.title}
                      <span className="block text-xs text-slate-500">
                        {l.unit.course?.title ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-700">
                        {l.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center tabular-nums text-slate-700">
                      {l._count.parts}
                    </td>
                    <td className="px-4 py-3.5 text-center tabular-nums text-slate-700">
                      {l._count.flashcards}
                    </td>
                    <td className="px-4 py-3.5 text-center tabular-nums text-slate-700">
                      {l._count.exercises}
                    </td>
                    <td className="px-4 py-3.5">
                      {l.isActive ? (
                        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 ring-1 ring-emerald-600/15">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link
                        href={`/admin/lessons/${l.id}`}
                        className="font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {lessons.length === 0 && (
            <p className="px-6 py-12 text-center text-sm text-slate-500">
              No lessons yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
