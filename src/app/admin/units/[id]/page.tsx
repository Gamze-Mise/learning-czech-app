"use client";

import { use } from "react";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSaveSuccessModal from "@/components/admin/AdminSaveSuccessModal";
import UnitLessonsPanel from "@/components/admin/UnitLessonsPanel";
import UnitMetadataForm from "@/components/admin/UnitMetadataForm";
import { useAdminUnitEditor } from "@/hooks/admin/useAdminUnitEditor";

export default function EditUnitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const editor = useAdminUnitEditor(id);

  if (editor.loading) return <p className="text-slate-600">Loading…</p>;
  if (!editor.unit) {
    return (
      <div>
        <p className="text-red-600">{editor.loadError ?? "Not found"}</p>
        <Link href="/admin/units" className="text-indigo-600 hover:underline">
          ← Back
        </Link>
      </div>
    );
  }

  const unit = editor.unit;

  return (
    <div className="max-w-xl space-y-8 relative">
      <AdminSaveSuccessModal
        open={editor.saveSuccessOpen}
        titleId="unit-save-success-title"
        title="Saved"
        subtitle="Returning to the list…"
        actionLabel="Back to list"
        onAction={editor.goToUnits}
      />

      <AdminPageHeader
        title="Edit unit"
        description="Edit unit details, visibility, and manage lessons."
        action={
          <Link
            href="/admin/units"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back
          </Link>
        }
      />

      <UnitLessonsPanel unitId={unit.id} lessons={unit.lessons ?? []} />

      <UnitMetadataForm
        unit={unit}
        setUnit={editor.setUnit}
        saveError={editor.saveError}
        saving={editor.saving}
        onSubmit={editor.onSubmit}
      />
    </div>
  );
}
