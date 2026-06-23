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

type CourseRow = {
  id: number;
  title: string;
  order: number;
  level: number;
  isActive: boolean;
  _count: { units: number };
};

export default function AdminCoursesPage() {
  const { items: courses, loading, error } = useAdminListFetch<CourseRow>(
    "/api/admin/courses",
    "courses",
    "Could not load courses"
  );

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

      {loading ? <AdminListLoadingSkeleton titleWidth="w-44" /> : null}
      {error ? <AdminListError message={error} /> : null}

      {!loading && !error ? (
        <AdminTableShell isEmpty={courses.length === 0} emptyMessage="No courses yet.">
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
                    <span className="mr-2 tabular-nums text-slate-400">{c.order}.</span>
                    {c.title}
                  </td>
                  <td className="px-4 py-3.5 text-center tabular-nums text-slate-700">
                    {c._count.units}
                  </td>
                  <td className="px-4 py-3.5 tabular-nums text-slate-700">{c.level}</td>
                  <td className="px-4 py-3.5">
                    <AdminStatusBadge isActive={c.isActive} />
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
        </AdminTableShell>
      ) : null}
    </div>
  );
}
