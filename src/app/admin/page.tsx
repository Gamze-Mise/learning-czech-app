import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Card from "@/components/Card";
import {
  IconCourses,
  IconLessons,
  IconUnits,
} from "@/components/admin/AdminNavIcons";

export default function AdminHomePage() {
  const statsPromise = Promise.all([
    prisma.courses.count(),
    prisma.unit.count(),
    prisma.lesson.count(),
    prisma.flashcard.count(),
    prisma.exercise.count(),
  ]);

  const quickLinks = [
    {
      href: "/admin/courses",
      title: "Courses",
      desc: "Create, edit, and reorder courses.",
      Icon: IconCourses,
    },
    {
      href: "/admin/units",
      title: "Units",
      desc: "Organize units within courses.",
      Icon: IconUnits,
    },
    {
      href: "/admin/lessons",
      title: "Lessons",
      desc: "Lessons, parts, flashcards, and exercises.",
      Icon: IconLessons,
    },
  ] as const;

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          Dashboard
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Overview
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-slate-600">
          Manage courses, units, lessons, flashcards, and exercises from one
          place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {quickLinks.map(({ href, title, desc, Icon }) => (
          <Card
            key={href}
            href={href}
            className="group border border-slate-200/90 p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100 transition group-hover:bg-indigo-100/80">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-semibold text-slate-900">{title}</h2>
                <p className="mt-1 text-sm leading-snug text-slate-600">{desc}</p>
                <p className="mt-3 text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                  Open →
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <h2 className="font-semibold text-slate-900">Content totals</h2>
          <p className="mt-1 text-sm text-slate-600">
            Quick check that your database matches what you expect.
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <AdminCounts statsPromise={statsPromise} />
          </div>
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
          className="rounded-xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/80 px-4 py-3 shadow-sm"
        >
          <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            {it.label}
          </div>
          <div className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
            {it.value}
          </div>
        </div>
      ))}
    </>
  );
}
