"use client";

import AdminActiveToggle from "@/components/admin/AdminActiveToggle";
import AdminImageField from "@/components/admin/AdminImageField";
import { adminPrimaryButtonClass } from "@/components/admin/AdminPageHeader";
import type { useAdminNewLesson } from "@/hooks/admin/useAdminNewLesson";
import { adminFormInputClass } from "@/lib/admin/form-input";
import { LESSON_TYPES } from "@/lib/lessons/constants";
import { NEW_LESSON_TITLE_MAX } from "@/lib/lessons/new-lesson-validation";

type Form = ReturnType<typeof useAdminNewLesson>;

type Props = {
  form: Form;
};

export default function NewLessonMetadataForm({ form }: Props) {
  return (
    <form
      onSubmit={form.onSubmit}
      className="space-y-5 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm"
      noValidate
    >
      {form.formError ? (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800"
          role="alert"
        >
          {form.formError}
        </div>
      ) : null}

      <div className="grid gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Find unit
          </label>
          <input
            value={form.unitQuery}
            onChange={(e) => {
              form.setUnitQuery(e.target.value);
              form.setFieldErrors((f) => ({ ...f, unitId: undefined }));
            }}
            disabled={
              form.unitsLoading || !!form.unitsError || form.units.length === 0
            }
            placeholder="Search by unit or course…"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 disabled:bg-slate-100 disabled:text-slate-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Unit *
          </label>
          <select
            value={form.unitId}
            onChange={(e) => {
              form.setUnitId(e.target.value);
              form.setFieldErrors((f) => ({ ...f, unitId: undefined }));
              form.setFormError(null);
            }}
            disabled={
              form.unitsLoading || !!form.unitsError || form.units.length === 0
            }
            aria-invalid={Boolean(form.fieldErrors.unitId)}
            aria-describedby={form.fieldErrors.unitId ? "err-unit" : undefined}
            className={adminFormInputClass(Boolean(form.fieldErrors.unitId))}
          >
            <option value="">Select unit…</option>
            {form.unitsForSelect.map((u) => (
              <option key={u.id} value={u.id}>
                {u.title}
                {!u.isActive ? " (inactive)" : ""}
                {u.course?.title ? ` — ${u.course.title}` : ""}
              </option>
            ))}
          </select>
          {form.fieldErrors.unitId ? (
            <p id="err-unit" className="mt-1 text-xs font-medium text-red-600">
              {form.fieldErrors.unitId}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Title *{" "}
          <span className="font-normal text-slate-400">
            ({form.title.trim().length}/{NEW_LESSON_TITLE_MAX})
          </span>
        </label>
        <input
          value={form.title}
          onChange={(e) => {
            form.setTitle(e.target.value);
            form.setFieldErrors((f) => ({ ...f, title: undefined }));
            form.setFormError(null);
          }}
          maxLength={NEW_LESSON_TITLE_MAX}
          disabled={form.unitsLoading || !!form.unitsError}
          aria-invalid={Boolean(form.fieldErrors.title)}
          aria-describedby={form.fieldErrors.title ? "err-title" : undefined}
          className={adminFormInputClass(Boolean(form.fieldErrors.title))}
          placeholder="e.g. Greetings in a café"
        />
        {form.fieldErrors.title ? (
          <p id="err-title" className="mt-1 text-xs font-medium text-red-600">
            {form.fieldErrors.title}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Difficulty
          </label>
          <input
            type="number"
            min={1}
            max={5}
            step={1}
            value={form.difficulty}
            onChange={(e) => {
              form.setDifficulty(e.target.value);
              form.setFieldErrors((f) => ({ ...f, difficulty: undefined }));
              form.setFormError(null);
            }}
            aria-invalid={Boolean(form.fieldErrors.difficulty)}
            aria-describedby={form.fieldErrors.difficulty ? "err-diff" : undefined}
            className={adminFormInputClass(Boolean(form.fieldErrors.difficulty))}
          />
          {form.fieldErrors.difficulty ? (
            <p id="err-diff" className="mt-1 text-xs font-medium text-red-600">
              {form.fieldErrors.difficulty}
            </p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Estimated time (min)
          </label>
          <input
            type="number"
            min={0}
            step={1}
            value={form.estimatedTime}
            onChange={(e) => {
              form.setEstimatedTime(e.target.value);
              form.setFieldErrors((f) => ({ ...f, estimatedTime: undefined }));
              form.setFormError(null);
            }}
            placeholder="optional"
            aria-invalid={Boolean(form.fieldErrors.estimatedTime)}
            aria-describedby={
              form.fieldErrors.estimatedTime ? "err-time" : undefined
            }
            className={adminFormInputClass(Boolean(form.fieldErrors.estimatedTime))}
          />
          {form.fieldErrors.estimatedTime ? (
            <p id="err-time" className="mt-1 text-xs font-medium text-red-600">
              {form.fieldErrors.estimatedTime}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Type
        </label>
        <select
          value={form.type}
          onChange={(e) => form.setType(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
        >
          {LESSON_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => form.setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
        />
      </div>

      <div
        className={form.fieldErrors.thumbnail ? "rounded-xl ring-2 ring-red-200" : ""}
      >
        <AdminImageField
          label="Lesson cover"
          value={form.thumbnail}
          onChange={(v) => {
            form.setThumbnail(v);
            form.setFieldErrors((f) => ({ ...f, thumbnail: undefined }));
            form.setFormError(null);
          }}
          description="Optional thumbnail for lesson lists."
          enableFileUpload
        />
        {form.fieldErrors.thumbnail ? (
          <p className="mt-1 text-xs font-medium text-red-600">
            {form.fieldErrors.thumbnail}
          </p>
        ) : null}
      </div>

      <AdminActiveToggle
        isActive={form.isActive}
        onChange={form.setIsActive}
        inactiveDescription="Inactive (hidden in app)"
      />

      <button
        type="submit"
        disabled={!form.canSubmit}
        className={
          adminPrimaryButtonClass +
          (!form.canSubmit || form.submitting ? " cursor-not-allowed opacity-60" : "")
        }
      >
        {form.submitting ? "Creating…" : "Create lesson"}
      </button>
      {!form.canSubmit && !form.submitting && form.units.length > 0 && !form.unitsLoading ? (
        <p className="text-center text-xs text-slate-500">
          Choose a unit and enter a title to enable create.
        </p>
      ) : null}
    </form>
  );
}
