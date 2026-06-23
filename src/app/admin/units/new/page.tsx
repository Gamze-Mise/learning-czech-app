"use client";

import Link from "next/link";
import AdminPageHeader, {
  adminPrimaryButtonClass,
} from "@/components/admin/AdminPageHeader";
import AdminImageField from "@/components/admin/AdminImageField";
import AdminActiveToggle from "@/components/admin/AdminActiveToggle";
import AdminSaveSuccessModal from "@/components/admin/AdminSaveSuccessModal";
import { useAdminNewUnit } from "@/hooks/admin/useAdminNewUnit";

export default function NewUnitPage() {
  const form = useAdminNewUnit();

  return (
    <div className="max-w-xl space-y-8">
      <AdminSaveSuccessModal
        open={form.successOpen}
        titleId="unit-create-success-title"
        title="Created"
        subtitle="Returning to the list…"
        actionLabel="Back to list"
        onAction={form.goToUnits}
      />

      <AdminPageHeader
        title="New unit"
        description="Create a unit. Order is assigned automatically."
        action={
          <Link
            href="/admin/units"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back
          </Link>
        }
      />

      <form
        onSubmit={form.onSubmit}
        className="space-y-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm"
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
          description="Optional cover image for this unit in the app."
          enableFileUpload
        />

        <AdminActiveToggle isActive={form.isActive} onChange={form.setIsActive} />

        <button
          type="submit"
          disabled={form.loading}
          className={adminPrimaryButtonClass + (form.loading ? " opacity-60" : "")}
        >
          {form.loading ? "Creating…" : "Create unit"}
        </button>
      </form>
    </div>
  );
}
