"use client";

import Link from "next/link";
import AdminPageHeader, {
  adminPrimaryButtonClass,
} from "@/components/admin/AdminPageHeader";
import AdminActiveToggle from "@/components/admin/AdminActiveToggle";
import AdminImageField from "@/components/admin/AdminImageField";
import { useAdminNewCourse } from "@/hooks/admin/useAdminNewCourse";

export default function NewCoursePage() {
  const form = useAdminNewCourse();

  return (
    <div className="max-w-xl space-y-8">
      <AdminPageHeader
        title="New course"
        action={
          <Link
            href="/admin/courses"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back
          </Link>
        }
      />

      <form
        onSubmit={form.onSubmit}
        className="space-y-5 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm"
      >
        {form.error ? (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{form.error}</p>
        ) : null}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
          <input
            required
            value={form.title}
            onChange={(e) => form.setTitle(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Order</label>
            <input
              type="number"
              min={1}
              value={form.order}
              onChange={(e) => form.setOrder(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Level</label>
            <input
              type="number"
              min={1}
              value={form.level}
              onChange={(e) => form.setLevel(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => form.setDescription(e.target.value)}
            rows={4}
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
          />
        </div>

        <AdminImageField
          label="Thumbnail"
          value={form.thumbnail}
          onChange={form.setThumbnail}
          description="Optional course cover — upload or paste a URL."
          enableFileUpload
        />

        <AdminActiveToggle isActive={form.isActive} onChange={form.setIsActive} />

        <button
          type="submit"
          disabled={form.loading}
          className={adminPrimaryButtonClass + (form.loading ? " opacity-60" : "")}
        >
          {form.loading ? "Creating…" : "Create course"}
        </button>
      </form>
    </div>
  );
}
