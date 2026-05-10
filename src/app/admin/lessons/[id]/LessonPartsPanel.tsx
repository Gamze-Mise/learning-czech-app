"use client";

import AdminAudioField from "@/components/admin/AdminAudioField";
import { useState } from "react";

export type NewPartState = {
  type: string;
  title: string;
  duration: string;
  audioUrl: string;
  videoUrl: string;
  content: string;
};

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

const PART_TYPES = [
  "TEXT",
  "AUDIO",
  "VIDEO",
  "FLASHCARD_LIST",
  "EXERCISE",
  "QUIZ",
  "INTERACTIVE",
] as const;

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
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const visibleParts = parts.filter((p: any) => {
    const title = String(p?.title ?? "")
      .trim()
      .toLowerCase();
    return title !== "pronunciation guide";
  });

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
            draggable={editingPartId == null}
            onDragStart={() => setDraggingId(p.id)}
            onDragEnd={() => setDraggingId(null)}
            onDragOver={(e) => {
              if (draggingId == null || draggingId === p.id) return;
              e.preventDefault();
            }}
            onDrop={(e) => {
              if (draggingId == null || draggingId === p.id) return;
              e.preventDefault();
              onReorderPart(draggingId, index);
              setDraggingId(null);
            }}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
          >
            {editingPartId === p.id && partDraft ? (
              <div className="w-full space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-600">
                    #{index + 1}
                  </div>
                  <select
                    value={partDraft.type}
                    onChange={(e) => setPartDraft({ ...partDraft, type: e.target.value })}
                    className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
                  >
                    {PART_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <input
                    value={partDraft.duration}
                    onChange={(e) => setPartDraft({ ...partDraft, duration: e.target.value })}
                    placeholder="duration"
                    className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
                  />
                </div>
                <input
                  value={partDraft.title}
                  onChange={(e) => setPartDraft({ ...partDraft, title: e.target.value })}
                  placeholder="Title"
                  className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
                />
                {partDraft.type === "AUDIO" ? (
                  <AdminAudioField
                    compact
                    label="Audio"
                    value={partDraft.audioUrl ?? ""}
                    onChange={(v) => setPartDraft({ ...partDraft, audioUrl: v })}
                    enableFileUpload
                  />
                ) : null}

                {partDraft.type === "VIDEO" ? (
                  <input
                    value={partDraft.videoUrl}
                    onChange={(e) => setPartDraft({ ...partDraft, videoUrl: e.target.value })}
                    placeholder="Video URL"
                    className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
                  />
                ) : null}

                {partDraft.type === "TEXT" ? (
                  <textarea
                    value={partDraft.content}
                    onChange={(e) => setPartDraft({ ...partDraft, content: e.target.value })}
                    rows={2}
                    placeholder="Content markdown"
                    className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
                  />
                ) : null}
                <label className="flex items-center gap-2 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={partDraft.isActive}
                    onChange={(e) => setPartDraft({ ...partDraft, isActive: e.target.checked })}
                  />
                  Active
                </label>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onCancelEditPart}
                    className="text-xs font-semibold text-slate-600 hover:underline"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={busyPart}
                    onClick={() => onSavePart(p.id)}
                    className="text-xs font-semibold text-indigo-700 hover:underline"
                  >
                    Save
                  </button>
                </div>
              </div>
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
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={busyPart}
                    onClick={() => onStartEditPart(p)}
                    className="text-xs font-semibold text-indigo-700 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={busyPart}
                    onClick={() => onDeactivatePart(p.id)}
                    className="text-xs font-semibold text-rose-700 hover:underline"
                  >
                    Deactivate
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {visibleParts.length === 0 && <p className="text-sm text-slate-500">No parts yet.</p>}
      </div>

      <form onSubmit={onAddPart} className="grid grid-cols-1 gap-3 pt-2 md:grid-cols-2">
        <div className="grid grid-cols-2 gap-3 md:col-span-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Type</label>
            <select
              value={newPart.type}
              onChange={(e) => setNewPart({ ...newPart, type: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            >
              {PART_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-slate-700">Title</label>
          <input
            value={newPart.title}
            onChange={(e) => setNewPart({ ...newPart, title: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            placeholder="e.g. Introduction"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">Duration (s)</label>
          <input
            value={newPart.duration}
            onChange={(e) => setNewPart({ ...newPart, duration: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            placeholder="e.g. 90"
          />
        </div>

        {newPart.type === "AUDIO" ? (
          <div className="md:col-span-2">
            <AdminAudioField
              label="Audio"
              value={newPart.audioUrl}
              onChange={(v) => setNewPart({ ...newPart, audioUrl: v })}
              enableFileUpload
            />
          </div>
        ) : null}

        {newPart.type === "VIDEO" ? (
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-700">Video URL</label>
            <input
              value={newPart.videoUrl}
              onChange={(e) => setNewPart({ ...newPart, videoUrl: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              placeholder="https://…"
            />
          </div>
        ) : null}

        {newPart.type === "TEXT" ? (
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Text content (markdown)
            </label>
            <textarea
              value={newPart.content}
              onChange={(e) => setNewPart({ ...newPart, content: e.target.value })}
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              placeholder="Write intro text…"
            />
          </div>
        ) : null}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={busyPart}
            className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {busyPart ? "Saving…" : "Add part"}
          </button>
        </div>
      </form>
    </div>
  );
}
