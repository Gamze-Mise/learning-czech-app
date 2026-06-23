import Link from "next/link";

type Props = {
  courseId: number;
  units: Array<{
    id: number;
    title: string;
    order: number;
    level: number;
    isActive: boolean;
  }>;
};

export default function CourseUnitsPanel({ courseId, units }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-900">Units in this course</h2>
          <p className="text-sm text-slate-600 mt-1">
            Jump into a unit to manage its lessons.
          </p>
        </div>
        <Link
          href={`/admin/units/new?courseId=${encodeURIComponent(String(courseId))}`}
          className="shrink-0 inline-flex items-center justify-center px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
        >
          + New unit
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="px-3 py-2.5 font-semibold">Unit</th>
              <th className="px-3 py-2.5 font-semibold">Level</th>
              <th className="px-3 py-2.5 font-semibold">Status</th>
              <th className="px-3 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr key={u.id} className="border-b border-slate-100">
                <td className="px-3 py-2.5 font-medium text-slate-900">
                  <span className="text-slate-400 mr-2">{u.order}.</span>
                  {u.title}
                </td>
                <td className="px-3 py-2.5 text-slate-700">{u.level}</td>
                <td className="px-3 py-2.5">
                  {u.isActive ? (
                    <span className="text-green-700">Active</span>
                  ) : (
                    <span className="text-slate-500">Inactive</span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-right">
                  <Link
                    href={`/admin/units/${u.id}`}
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
            {units.length === 0 ? (
              <tr>
                <td className="px-3 py-6 text-center text-slate-500" colSpan={4}>
                  No units yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
