"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminPageHeader, {
  adminPrimaryButtonClass,
} from "@/components/admin/AdminPageHeader";

type CourseRow = {
  id: number;
  title: string;
  order: number;
  level: number;
  isActive: boolean;
  _count: { units: number };
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/courses")
      .then((r) => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then((d) => setCourses(d.courses ?? []))
      .catch(() => setError("Could not load courses"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Courses"
        description="Create and organize top-level courses. Each course can contain multiple units."
        action={
          <Link href="/admin/courses/new" className={adminPrimaryButtonClass}>
            + New course
          </Link>
        }
      />

      {loading && (
        <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <div className="h-4 w-44 animate-pulse rounded bg-slate-200" />
          <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
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
                  <th className="px-4 py-3.5">Course</th>
                  <th className="px-4 py-3.5 text-center">Units</th>
                  <th className="px-4 py-3.5">Level</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50/80"
                  >
                    <td className="px-4 py-3.5 font-medium text-slate-900">
                      <span className="mr-2 tabular-nums text-slate-400">
                        {c.order}.
                      </span>
                      {c.title}
                    </td>
                    <td className="px-4 py-3.5 text-center tabular-nums text-slate-700">
                      {c._count.units}
                    </td>
                    <td className="px-4 py-3.5 tabular-nums text-slate-700">
                      {c.level}
                    </td>
                    <td className="px-4 py-3.5">
                      {c.isActive ? (
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
                        href={`/admin/courses/${c.id}`}
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
          {courses.length === 0 && (
            <p className="px-6 py-12 text-center text-sm text-slate-500">
              No courses yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
