"use client";

import AdminImageField from "@/components/admin/AdminImageField";
import AdminActiveToggle from "@/components/admin/AdminActiveToggle";
import { adminPrimaryButtonClass } from "@/components/admin/AdminPageHeader";
import { LESSON_TYPES } from "@/lib/lessons/constants";
import type { LessonDetail } from "@/lib/lessons/types";

type Props = {
  lesson: LessonDetail;
  setLesson: React.Dispatch<React.SetStateAction<LessonDetail | null>>;
  saveError: string | null;
  saving: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

export default function LessonMetadataForm({
  lesson,
  setLesson,
  saveError,
  saving,
  onSubmit,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm"
    >
      {saveError ? (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{saveError}</p>
      ) : null}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
        <input
          value={lesson.title}
          onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
          <input
            type="number"
            min={1}
            max={5}
            value={lesson.difficulty}
            onChange={(e) =>
              setLesson({ ...lesson, difficulty: Number(e.target.value) })
            }
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
        <select
          value={lesson.type}
          onChange={(e) => setLesson({ ...lesson, type: e.target.value })}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
        >
          {LESSON_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          value={lesson.description ?? ""}
          onChange={(e) =>
            setLesson({ ...lesson, description: e.target.value || null })
          }
          rows={4}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Estimated time (minutes)
        </label>
        <input
          type="number"
          min={0}
          value={lesson.estimatedTime ?? ""}
          onChange={(e) =>
            setLesson({
              ...lesson,
              estimatedTime: e.target.value ? Number(e.target.value) : null,
            })
          }
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
        />
      </div>

      <AdminImageField
        label="Lesson cover"
        value={lesson.thumbnail ?? ""}
        onChange={(v) => setLesson({ ...lesson, thumbnail: v.trim() || null })}
        description="Shown in lists where a thumbnail is used. Upload or paste a URL."
        enableFileUpload
      />

      <AdminActiveToggle
        isActive={lesson.isActive}
        onChange={(next) => setLesson({ ...lesson, isActive: next })}
      />

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
