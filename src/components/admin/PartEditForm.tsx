"use client";

import { PartTypeSelect, PartTypeSpecificFields, type PartFieldsValue } from "./PartFormFields";

type PartDraft = PartFieldsValue & { isActive: boolean };

type Props = {
  index: number;
  draft: PartDraft;
  busy: boolean;
  onChange: (next: PartDraft) => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function PartEditForm({
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
        <PartTypeSelect
          value={draft.type}
          onChange={(type) => onChange({ ...draft, type })}
          className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
        />
        <input
          value={draft.duration}
          onChange={(e) => onChange({ ...draft, duration: e.target.value })}
          placeholder="duration"
          className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
        />
      </div>
      <input
        value={draft.title}
        onChange={(e) => onChange({ ...draft, title: e.target.value })}
        placeholder="Title"
        className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
      />
      <PartTypeSpecificFields
        value={draft}
        onChange={(next) => onChange({ ...draft, ...next })}
        variant="compact"
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
