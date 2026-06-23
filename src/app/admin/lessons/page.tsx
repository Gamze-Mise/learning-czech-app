"use client";

import Link from "next/link";
import AdminPageHeader, {
  adminPrimaryButtonClass,
} from "@/components/admin/AdminPageHeader";
import {
  AdminListError,
  AdminListLoadingSkeleton,
  AdminTableShell,
} from "@/components/admin/AdminListState";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { useAdminListFetch } from "@/hooks/admin/useAdminListFetch";

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
  const { items: lessons, loading, error } = useAdminListFetch<LessonRow>(
    "/api/admin/lessons",
    "lessons",
    "Could not load lessons"
  );

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

      {loading ? <AdminListLoadingSkeleton titleWidth="w-48" /> : null}
      {error ? <AdminListError message={error} /> : null}

      {!loading && !error ? (
        <AdminTableShell isEmpty={lessons.length === 0} emptyMessage="No lessons yet.">
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
                    <span className="mr-2 tabular-nums text-slate-400">{l.order}.</span>
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
                    <AdminStatusBadge isActive={l.isActive} />
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
        </AdminTableShell>
      ) : null}
    </div>
  );
}
