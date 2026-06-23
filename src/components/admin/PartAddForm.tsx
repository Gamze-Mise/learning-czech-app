"use client";

import { PartTypeSelect, PartTypeSpecificFields, type PartFieldsValue } from "./PartFormFields";
import type { NewPartState } from "@/lib/lessons/admin-form-types";

type Props = {
  value: NewPartState;
  onChange: (next: NewPartState) => void;
  busy: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

export default function PartAddForm({ value, onChange, busy, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 pt-2 md:grid-cols-2">
      <div className="grid grid-cols-2 gap-3 md:col-span-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">Type</label>
          <PartTypeSelect
            value={value.type}
            onChange={(type) => onChange({ ...value, type })}
          />
        </div>
      </div>
      <div className="md:col-span-2">
        <label className="mb-1 block text-xs font-semibold text-slate-700">Title</label>
        <input
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          placeholder="e.g. Introduction"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-700">Duration (s)</label>
        <input
          value={value.duration}
          onChange={(e) => onChange({ ...value, duration: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          placeholder="e.g. 90"
        />
      </div>
      <PartTypeSpecificFields
        value={value}
        onChange={(next) => onChange({ ...value, ...next })}
        variant="labeled"
      />
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {busy ? "Saving…" : "Add part"}
        </button>
      </div>
    </form>
  );
}
