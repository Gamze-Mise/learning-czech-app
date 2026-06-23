"use client";

import AdminImageField from "@/components/admin/AdminImageField";
import AdminAudioField from "@/components/admin/AdminAudioField";
import type { NewCardState } from "@/lib/lessons/admin-form-types";

type CardDraft = NewCardState & { isActive: boolean };

type Props = {
  index: number;
  draft: CardDraft;
  busy: boolean;
  onChange: (next: CardDraft) => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function FlashcardEditForm({
  index,
  draft,
  busy,
  onChange,
  onSave,
  onCancel,
}: Props) {
  return (
    <div className="w-full space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-600">
          #{index + 1}
        </div>
        <input
          value={draft.difficulty}
          onChange={(e) => onChange({ ...draft, difficulty: e.target.value })}
          className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
        />
        <input
          value={draft.category}
          onChange={(e) => onChange({ ...draft, category: e.target.value })}
          placeholder="category"
          className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
        />
      </div>
      <input
        value={draft.frontText}
        onChange={(e) => onChange({ ...draft, frontText: e.target.value })}
        placeholder="Front"
        className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
      />
      <input
        value={draft.backText}
        onChange={(e) => onChange({ ...draft, backText: e.target.value })}
        placeholder="Back"
        className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
      />
      <AdminImageField
        compact
        label="Image"
        value={draft.imageUrl ?? ""}
        onChange={(v) => onChange({ ...draft, imageUrl: v })}
        description="URL or upload; shown on the learner card when set."
        enableFileUpload
      />
      <AdminAudioField
        compact
        label="Audio"
        value={draft.audioUrl ?? ""}
        onChange={(v) => onChange({ ...draft, audioUrl: v })}
        enableFileUpload
      />
      <input
        value={draft.example}
        onChange={(e) => onChange({ ...draft, example: e.target.value })}
        placeholder="Example"
        className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
      />
      <label className="flex items-center gap-2 text-xs text-slate-700">
        <input
          type="checkbox"
          checked={draft.isActive}
          onChange={(e) => onChange({ ...draft, isActive: e.target.checked })}
        />
        Active
      </label>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-semibold text-slate-600 hover:underline"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onSave}
          className="text-xs font-semibold text-indigo-700 hover:underline"
        >
          Save
        </button>
      </div>
    </div>
  );
}
