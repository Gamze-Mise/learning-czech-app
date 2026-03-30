import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default function AdminHomePage() {
  const statsPromise = Promise.all([
    prisma.courses.count(),
    prisma.unit.count(),
    prisma.lesson.count(),
    prisma.flashcard.count(),
    prisma.exercise.count(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
        <p className="text-slate-600 mt-1">
          Manage courses, units, lessons, flashcards, and exercises.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/courses"
          className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-indigo-300 hover:shadow transition"
        >
          <h2 className="font-semibold text-slate-900">Courses</h2>
          <p className="text-sm text-slate-600 mt-2">
            Create, edit, and reorder courses.
          </p>
        </Link>
        <Link
          href="/admin/units"
          className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-indigo-300 hover:shadow transition"
        >
          <h2 className="font-semibold text-slate-900">Units</h2>
          <p className="text-sm text-slate-600 mt-2">
            Organize units and assign them to a course.
          </p>
        </Link>
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

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">Content totals</h2>
        <p className="text-sm text-slate-600 mt-1">
          Quick sanity check that Production DB matches what you expect.
        </p>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
          <AdminCounts statsPromise={statsPromise} />
        </div>
      </div>
    </div>
  );
}

async function AdminCounts({
  statsPromise,
}: {
  statsPromise: Promise<[number, number, number, number, number]>;
}) {
  const [courses, units, lessons, flashcards, exercises] = await statsPromise;
  const items = [
    { label: "Courses", value: courses },
    { label: "Units", value: units },
    { label: "Lessons", value: lessons },
    { label: "Flashcards", value: flashcards },
    { label: "Exercises", value: exercises },
  ];
  return (
    <>
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
        >
          <div className="text-slate-500 text-xs">{it.label}</div>
          <div className="text-slate-900 font-semibold">{it.value}</div>
        </div>
      ))}
    </>
  );
}
