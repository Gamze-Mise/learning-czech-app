"use client";

import { FlashcardCoreFields } from "./FlashcardFormFields";
import type { NewCardState } from "@/lib/lessons/admin-form-types";

type Props = {
  value: NewCardState;
  onChange: (next: NewCardState) => void;
  busy: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

export default function FlashcardAddForm({ value, onChange, busy, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 pt-2 md:grid-cols-2">
      <FlashcardCoreFields value={value} onChange={onChange} />
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {busy ? "Saving…" : "Add flashcard"}
        </button>
      </div>
    </form>
  );
}
