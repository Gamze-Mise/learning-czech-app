"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminPageHeader, {
  adminPrimaryButtonClass,
} from "@/components/admin/AdminPageHeader";

type UnitRow = {
  id: number;
  title: string;
  order: number;
  level: number;
  isActive: boolean;
  course: { id: number; title: string } | null;
  _count: { lessons: number };
};

export default function AdminUnitsPage() {
  const [units, setUnits] = useState<UnitRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/units")
      .then((r) => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then((d) => setUnits(d.units ?? []))
      .catch(() => setError("Could not load units"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Units"
        description="Manage units, levels, and visibility. Order is handled automatically when you create new units."
        action={
          <Link href="/admin/units/new" className={adminPrimaryButtonClass}>
            + New unit
          </Link>
        }
      />

      {loading && (
        <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
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
                  <th className="px-4 py-3.5">Unit</th>
                  <th className="px-4 py-3.5">Course</th>
                  <th className="px-4 py-3.5 text-center">Lessons</th>
                  <th className="px-4 py-3.5">Level</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {units.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50/80"
                  >
                    <td className="px-4 py-3.5 font-medium text-slate-900">
                      <span className="mr-2 tabular-nums text-slate-400">
                        {u.order}.
                      </span>
                      {u.title}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">
                      {u.course?.title ?? "—"}
                    </td>
                    <td className="px-4 py-3.5 text-center tabular-nums text-slate-700">
                      {u._count.lessons}
                    </td>
                    <td className="px-4 py-3.5 tabular-nums text-slate-700">
                      {u.level}
                    </td>
                    <td className="px-4 py-3.5">
                      {u.isActive ? (
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
                        href={`/admin/units/${u.id}`}
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
          {units.length === 0 && (
            <p className="px-6 py-12 text-center text-sm text-slate-500">
              No units yet. Create your first unit to get started.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
