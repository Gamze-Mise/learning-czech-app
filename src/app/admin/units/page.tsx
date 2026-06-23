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
  const { items: units, loading, error } = useAdminListFetch<UnitRow>(
    "/api/admin/units",
    "units",
    "Could not load units"
  );

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

      {loading ? <AdminListLoadingSkeleton titleWidth="w-40" /> : null}
      {error ? <AdminListError message={error} /> : null}

      {!loading && !error ? (
        <AdminTableShell
          isEmpty={units.length === 0}
          emptyMessage="No units yet. Create your first unit to get started."
        >
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
                    <span className="mr-2 tabular-nums text-slate-400">{u.order}.</span>
                    {u.title}
                  </td>
                  <td className="px-4 py-3.5 text-slate-700">{u.course?.title ?? "—"}</td>
                  <td className="px-4 py-3.5 text-center tabular-nums text-slate-700">
                    {u._count.lessons}
                  </td>
                  <td className="px-4 py-3.5 tabular-nums text-slate-700">{u.level}</td>
                  <td className="px-4 py-3.5">
                    <AdminStatusBadge isActive={u.isActive} />
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
        </AdminTableShell>
      ) : null}
    </div>
  );
}
