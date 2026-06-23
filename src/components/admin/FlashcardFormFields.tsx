"use client";

import AdminImageField from "@/components/admin/AdminImageField";
import AdminAudioField from "@/components/admin/AdminAudioField";
import type { NewCardState } from "@/lib/lessons/admin-form-types";

type Props = {
  value: NewCardState;
  onChange: (next: NewCardState) => void;
};

export function FlashcardCoreFields({ value, onChange }: Props) {
  const inputClass = "w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900";

  return (
    <>
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-700">Difficulty</label>
        <input
          value={value.difficulty}
          onChange={(e) => onChange({ ...value, difficulty: e.target.value })}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-700">Front *</label>
        <input
          required
          value={value.frontText}
          onChange={(e) => onChange({ ...value, frontText: e.target.value })}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-700">Back *</label>
        <input
          required
          value={value.backText}
          onChange={(e) => onChange({ ...value, backText: e.target.value })}
          className={inputClass}
        />
      </div>
      <div className="md:col-span-2">
        <label className="mb-1 block text-xs font-semibold text-slate-700">Example</label>
        <input
          value={value.example}
          onChange={(e) => onChange({ ...value, example: e.target.value })}
          className={inputClass}
        />
      </div>
      <div className="md:col-span-2">
        <AdminImageField
          compact
          label="Image"
          value={value.imageUrl}
          onChange={(v) => onChange({ ...value, imageUrl: v })}
          enableFileUpload
        />
      </div>
      <div className="md:col-span-2">
        <AdminAudioField
          label="Audio"
          value={value.audioUrl}
          onChange={(v) => onChange({ ...value, audioUrl: v })}
          enableFileUpload
        />
      </div>
      <div className="md:col-span-2">
        <label className="mb-1 block text-xs font-semibold text-slate-700">Category</label>
        <input
          value={value.category}
          onChange={(e) => onChange({ ...value, category: e.target.value })}
          className={inputClass}
        />
      </div>
    </>
  );
}
