"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lessons</h1>
          <p className="text-slate-600 mt-1">
            Create and edit lessons per unit. Deactivated lessons stay hidden in
            the app.
          </p>
        </div>
        <Link
          href="/admin/lessons/new"
          className="inline-flex justify-center items-center px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
        >
          + New lesson
        </Link>
      </div>

      {loading && (
        <p className="text-slate-600">Loading…</p>
      )}
      {error && (
        <p className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</p>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="px-4 py-3 font-semibold">Lesson</th>
                <th className="px-4 py-3 font-semibold">Unit / Course</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold text-center">Parts</th>
                <th className="px-4 py-3 font-semibold text-center">Cards</th>
                <th className="px-4 py-3 font-semibold text-center">Ex.</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {lessons.map((l) => (
                <tr key={l.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <span className="text-slate-400 mr-2">{l.order}.</span>
                    {l.title}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {l.unit.title}
                    <span className="text-slate-400 text-xs block">
                      {l.unit.course?.title ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{l.type}</td>
                  <td className="px-4 py-3 text-center">{l._count.parts}</td>
                  <td className="px-4 py-3 text-center">{l._count.flashcards}</td>
                  <td className="px-4 py-3 text-center">{l._count.exercises}</td>
                  <td className="px-4 py-3">
                    {l.isActive ? (
                      <span className="text-green-700">Active</span>
                    ) : (
                      <span className="text-slate-500">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/lessons/${l.id}`}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {lessons.length === 0 && (
            <p className="p-8 text-center text-slate-500">No lessons yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
