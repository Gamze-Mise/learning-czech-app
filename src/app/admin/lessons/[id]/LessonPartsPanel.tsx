"use client";

import PartEditForm from "@/components/admin/PartEditForm";
import PartAddForm from "@/components/admin/PartAddForm";
import AdminInlineListActions from "@/components/admin/AdminInlineListActions";
import { useAdminDraggableReorder } from "@/hooks/admin/useAdminDraggableReorder";
import { filterVisibleLessonParts } from "@/lib/lessons/parts";
import type { NewPartState } from "@/lib/lessons/admin-form-types";

export type { NewPartState };

type Props = {
  parts: any[];
  busyPart: boolean;
  newPart: NewPartState;
  setNewPart: React.Dispatch<React.SetStateAction<NewPartState>>;
  editingPartId: number | null;
  partDraft: any | null;
  setPartDraft: React.Dispatch<React.SetStateAction<any | null>>;
  onAddPart: (e: React.FormEvent) => void;
  onDeactivatePart: (partId: number) => void;
  onStartEditPart: (part: any) => void;
  onSavePart: (partId: number) => void;
  onCancelEditPart: () => void;
  onReorderPart: (partId: number, targetIndex: number) => void;
};

export default function LessonPartsPanel({
  parts,
  busyPart,
  newPart,
  setNewPart,
  editingPartId,
  partDraft,
  setPartDraft,
  onAddPart,
  onDeactivatePart,
  onStartEditPart,
  onSavePart,
  onCancelEditPart,
  onReorderPart,
}: Props) {
  const { getDragHandlers } = useAdminDraggableReorder();
  const visibleParts = filterVisibleLessonParts(parts);

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Lesson parts</h2>
          <p className="text-sm text-slate-600">Introduction, audio, video, etc.</p>
        </div>
        <span className="text-sm text-slate-500">{visibleParts.length} total</span>
      </div>

      <div className="space-y-2">
        {visibleParts.map((p: any, index: number) => (
          <div
            key={p.id}
            {...getDragHandlers(p.id, index, editingPartId == null, onReorderPart)}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
          >
            {editingPartId === p.id && partDraft ? (
              <PartEditForm
                index={index}
                draft={partDraft}
                busy={busyPart}
                onChange={(next) => setPartDraft(next)}
                onSave={() => onSavePart(p.id)}
                onCancel={onCancelEditPart}
              />
            ) : (
              <>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-900">
                    <span className="mr-2 inline-flex select-none items-center text-slate-400" aria-hidden>
                      ⋮⋮
                    </span>
                    {index + 1}. {p.title ?? "(untitled)"}
                  </div>
                  <div className="text-xs text-slate-600">
                    {p.type} {p.duration ? `• ${p.duration}s` : ""}{" "}
                    {!p.isActive ? "• Inactive" : ""}
                  </div>
                </div>
                <AdminInlineListActions
                  busy={busyPart}
                  onEdit={() => onStartEditPart(p)}
                  onDeactivate={() => onDeactivatePart(p.id)}
                />
              </>
            )}
          </div>
        ))}
        {visibleParts.length === 0 && <p className="text-sm text-slate-500">No parts yet.</p>}
      </div>

      <PartAddForm
        value={newPart}
        onChange={setNewPart}
        busy={busyPart}
        onSubmit={onAddPart}
      />
    </div>
  );
}
