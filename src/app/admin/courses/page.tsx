"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Courses</h1>
          <p className="text-slate-600 mt-1">Manage courses and ordering.</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="inline-flex justify-center items-center px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
        >
          + New course
        </Link>
      </div>

      {loading && <p className="text-slate-600">Loading…</p>}
      {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="px-4 py-3 font-semibold">Course</th>
                <th className="px-4 py-3 font-semibold text-center">Units</th>
                <th className="px-4 py-3 font-semibold">Level</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <span className="text-slate-400 mr-2">{c.order}.</span>
                    {c.title}
                  </td>
                  <td className="px-4 py-3 text-center">{c._count.units}</td>
                  <td className="px-4 py-3 text-slate-700">{c.level}</td>
                  <td className="px-4 py-3">
                    {c.isActive ? (
                      <span className="text-green-700">Active</span>
                    ) : (
                      <span className="text-slate-500">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/courses/${c.id}`}
                      className="text-indigo-600 font-medium hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {courses.length === 0 && (
            <p className="p-8 text-center text-slate-500">No courses yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

