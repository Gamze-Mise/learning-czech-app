"use client";

import AdminImageField from "@/components/admin/AdminImageField";
import AdminActiveToggle from "@/components/admin/AdminActiveToggle";
import { adminPrimaryButtonClass } from "@/components/admin/AdminPageHeader";
import type { UnitDetail } from "@/lib/units/types";

type Props = {
  unit: UnitDetail;
  setUnit: React.Dispatch<React.SetStateAction<UnitDetail | null>>;
  saveError: string | null;
  saving: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

export default function UnitMetadataForm({
  unit,
  setUnit,
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
          value={unit.title}
          onChange={(e) => setUnit({ ...unit, title: e.target.value })}
          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Level</label>
        <input
          type="number"
          min={1}
          value={unit.level}
          onChange={(e) => setUnit({ ...unit, level: Number(e.target.value) })}
          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          value={unit.description ?? ""}
          onChange={(e) => setUnit({ ...unit, description: e.target.value || null })}
          rows={4}
          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
        />
      </div>

      <AdminImageField
        label="Thumbnail"
        value={unit.thumbnail ?? ""}
        onChange={(v) => setUnit({ ...unit, thumbnail: v.trim() || null })}
        description="Upload a file (stored under /public/uploads) or paste an image URL."
        enableFileUpload
      />

      <AdminActiveToggle
        isActive={unit.isActive}
        onChange={(next) => setUnit({ ...unit, isActive: next })}
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
