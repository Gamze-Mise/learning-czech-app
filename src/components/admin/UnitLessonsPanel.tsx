import Link from "next/link";
import { adminPrimaryButtonClass } from "@/components/admin/AdminPageHeader";
import type { UnitLessonSummary } from "@/lib/units/types";

type Props = {
  unitId: number;
  lessons: UnitLessonSummary[];
};

export default function UnitLessonsPanel({ unitId, lessons }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-900">Lessons in this unit</h2>
          <p className="text-sm text-slate-600 mt-1">
            Jump into a lesson to manage parts, flashcards, and exercises.
          </p>
        </div>
        <Link
          href={`/admin/lessons/new?unitId=${encodeURIComponent(String(unitId))}`}
          className={adminPrimaryButtonClass}
        >
          + New lesson
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="px-3 py-2.5 font-semibold">Lesson</th>
              <th className="px-3 py-2.5 font-semibold">Type</th>
              <th className="px-3 py-2.5 font-semibold">Status</th>
              <th className="px-3 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {lessons.map((l) => (
              <tr key={l.id} className="border-b border-slate-100">
                <td className="px-3 py-2.5 font-medium text-slate-900">
                  <span className="text-slate-400 mr-2">{l.order}.</span>
                  {l.title}
                </td>
                <td className="px-3 py-2.5 text-slate-600">{l.type}</td>
                <td className="px-3 py-2.5">
                  {l.isActive ? (
                    <span className="text-green-700">Active</span>
                  ) : (
                    <span className="text-slate-500">Inactive</span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-right">
                  <Link
                    href={`/admin/lessons/${l.id}`}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
            {lessons.length === 0 ? (
              <tr>
                <td className="px-3 py-6 text-center text-slate-500" colSpan={4}>
                  No lessons yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
