"use client";

import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import LessonCreateSuccessModal from "@/components/admin/LessonCreateSuccessModal";
import NewLessonMetadataForm from "@/components/admin/NewLessonMetadataForm";
import { useAdminNewLesson } from "@/hooks/admin/useAdminNewLesson";

export default function NewLessonPage() {
  const form = useAdminNewLesson();

  return (
    <div className="max-w-xl space-y-8">
      <LessonCreateSuccessModal
        open={form.successOpen}
        createdLessonId={form.createdLessonId}
        onGoToLessons={form.goToLessons}
      />

      <AdminPageHeader
        title="New lesson"
        description="Step 1: create the lesson shell (unit, title, type). Step 2: on the next screen you add lesson parts, flashcards, and exercises."
        action={
          <Link
            href="/admin/lessons"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back
          </Link>
        }
      />

      {form.unitsLoading ? (
        <p className="text-sm text-slate-600">Loading units…</p>
      ) : null}

      {form.unitsError ? (
        <div
          className="rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-800"
          role="alert"
        >
          <p className="font-medium">Could not load units</p>
          <p className="mt-1 text-red-700/90">{form.unitsError}</p>
          <button
            type="button"
            onClick={() => void form.loadUnits()}
            className="mt-3 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-900 hover:bg-red-50"
          >
            Retry
          </button>
        </div>
      ) : null}

      {!form.unitsLoading && !form.unitsError && form.units.length === 0 ? (
        <div
          className="rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-sm text-amber-950"
          role="status"
        >
          <p className="font-medium">No units yet</p>
          <p className="mt-1 text-amber-900/90">
            Create a unit first, then you can attach lessons to it.
          </p>
          <Link
            href="/admin/units/new"
            className="mt-3 inline-block text-sm font-semibold text-amber-950 underline underline-offset-2 hover:text-amber-800"
          >
            New unit →
          </Link>
        </div>
      ) : null}

      {!form.unitsLoading && !form.unitsError && form.units.length > 0 ? (
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 text-sm text-indigo-950">
          <p className="font-medium text-indigo-950">Where is the rest?</p>
          <p className="mt-1 leading-relaxed text-indigo-900/90">
            This page only creates the lesson record. After you click{" "}
            <span className="font-semibold">Create lesson</span>, you go to{" "}
            <span className="font-semibold">Edit lesson</span> — there you add{" "}
            <span className="font-semibold">parts</span>,{" "}
            <span className="font-semibold">flashcards</span>, and{" "}
            <span className="font-semibold">exercises</span>.
          </p>
        </div>
      ) : null}

      <NewLessonMetadataForm form={form} />
    </div>
  );
}
