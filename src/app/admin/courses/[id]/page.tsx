"use client";

import { use } from "react";
import Link from "next/link";
import AdminDangerZone from "@/components/admin/AdminDangerZone";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import CourseMetadataForm from "@/components/admin/CourseMetadataForm";
import CourseUnitsPanel from "@/components/admin/CourseUnitsPanel";
import { useAdminCourseEditor } from "@/hooks/admin/useAdminCourseEditor";

export default function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const editor = useAdminCourseEditor(id);

  if (editor.loading) return <p className="text-slate-600">Loading…</p>;
  if (!editor.course) {
    return (
      <div>
        <p className="text-red-600">{editor.loadError ?? "Not found"}</p>
        <Link href="/admin/courses" className="text-indigo-600 hover:underline">
          ← Back
        </Link>
      </div>
    );
  }

  const course = editor.course;

  return (
    <div className="max-w-xl space-y-8">
      <AdminPageHeader
        title="Edit course"
        action={
          <Link
            href="/admin/courses"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back
          </Link>
        }
      />

      <CourseUnitsPanel courseId={course.id} units={course.units ?? []} />

      <CourseMetadataForm
        course={course}
        setCourse={editor.setCourse}
        saveError={editor.saveError}
        saving={editor.saving}
        onSubmit={editor.onSubmit}
      />

      <AdminDangerZone
        actionLabel="Deactivate course"
        onAction={editor.deactivateCourse}
      />
    </div>
  );
}
