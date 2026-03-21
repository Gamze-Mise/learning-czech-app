import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
        <p className="text-slate-600 mt-1">
          Manage lessons, and soon units, flashcards, and exercises from here.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/lessons"
          className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow transition"
        >
          <h2 className="font-semibold text-slate-900">Lessons</h2>
          <p className="text-sm text-slate-600 mt-2">
            Create, edit, or deactivate lessons. Assign unit, type, and order.
          </p>
        </Link>
      </div>
    </div>
  );
}
