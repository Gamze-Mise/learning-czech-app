"use client";

import AdminImageField from "@/components/admin/AdminImageField";
import { adminPrimaryButtonClass } from "@/components/admin/AdminPageHeader";
import type { CourseDetail } from "@/lib/courses/types";

type Props = {
  course: CourseDetail;
  setCourse: React.Dispatch<React.SetStateAction<CourseDetail | null>>;
  saveError: string | null;
  saving: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

export default function CourseMetadataForm({
  course,
  setCourse,
  saveError,
  saving,
  onSubmit,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
    >
      {saveError ? (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{saveError}</p>
      ) : null}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
        <input
          value={course.title}
          onChange={(e) => setCourse({ ...course, title: e.target.value })}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Order</label>
          <input
            type="number"
            min={1}
            value={course.order}
            onChange={(e) => setCourse({ ...course, order: Number(e.target.value) })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Level</label>
          <input
            type="number"
            min={1}
            value={course.level}
            onChange={(e) => setCourse({ ...course, level: Number(e.target.value) })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          value={course.description ?? ""}
          onChange={(e) =>
            setCourse({ ...course, description: e.target.value || null })
          }
          rows={4}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
        />
      </div>

      <AdminImageField
        label="Thumbnail"
        value={course.thumbnail ?? ""}
        onChange={(v) => setCourse({ ...course, thumbnail: v.trim() || null })}
        description="Upload or paste an image URL for the course card."
        enableFileUpload
      />

      <label className="flex items-center gap-2 text-slate-700">
        <input
          type="checkbox"
          checked={course.isActive}
          onChange={(e) => setCourse({ ...course, isActive: e.target.checked })}
        />
        Active
      </label>

      <button
        type="submit"
        disabled={saving}
        className={adminPrimaryButtonClass + (saving ? " opacity-60" : "")}
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
