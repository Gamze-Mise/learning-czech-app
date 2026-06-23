"use client";

import AdminImageField from "@/components/admin/AdminImageField";
import AdminAudioField from "@/components/admin/AdminAudioField";
import ExerciseOptionsEditor from "@/components/admin/ExerciseOptionsEditor";
import {
  allowExerciseAudio,
  allowExerciseTimeLimit,
  applyExerciseTypeChange,
  needsFillAnswer,
} from "@/lib/exercises/admin-rules";
import { EXERCISE_TYPES } from "@/lib/exercises/types";
import type { NewExState } from "@/lib/lessons/admin-form-types";

type Props = {
  value: NewExState;
  onChange: (next: NewExState) => void;
  busy: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

export default function ExerciseAddForm({ value, onChange, busy, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 pt-2 md:grid-cols-2">
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-700">Type</label>
        <select
          value={value.type}
          onChange={(e) => onChange(applyExerciseTypeChange(value, e.target.value))}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        >
          {EXERCISE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="mb-1 block text-xs font-semibold text-slate-700">Question *</label>
        <textarea
          required
          value={value.question}
          onChange={(e) => onChange({ ...value, question: e.target.value })}
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        />
      </div>
      <div className="md:col-span-2">
        <ExerciseOptionsEditor
          mode="new"
          type={value.type}
          optionsText={value.options}
          onChange={(next) => onChange({ ...value, options: next })}
        />
      </div>
      {needsFillAnswer(value.type) ? (
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">Answer *</label>
          <input
            required
            value={value.answer}
            onChange={(e) => onChange({ ...value, answer: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </div>
      ) : null}
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-700">Points</label>
        <input
          value={value.points}
          onChange={(e) => onChange({ ...value, points: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-700">Difficulty</label>
        <input
          value={value.difficulty}
          onChange={(e) => onChange({ ...value, difficulty: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        />
      </div>
      {allowExerciseTimeLimit(value.type) ? (
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">Time limit (s)</label>
          <input
            value={value.timeLimit}
            onChange={(e) => onChange({ ...value, timeLimit: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            placeholder="e.g. 60"
          />
        </div>
      ) : null}
      <div className="md:col-span-2">
        <AdminImageField
          compact
          label="Image"
          value={value.imageUrl}
          onChange={(v) => onChange({ ...value, imageUrl: v })}
          enableFileUpload
        />
      </div>
      {allowExerciseAudio(value.type) ? (
        <div className="md:col-span-2">
          <AdminAudioField
            label="Audio"
            value={value.audioUrl}
            onChange={(v) => onChange({ ...value, audioUrl: v })}
            enableFileUpload
          />
        </div>
      ) : null}
      <div className="md:col-span-2">
        <label className="mb-1 block text-xs font-semibold text-slate-700">Explanation</label>
        <textarea
          value={value.explanation}
          onChange={(e) => onChange({ ...value, explanation: e.target.value })}
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        />
      </div>
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {busy ? "Saving…" : "Add exercise"}
        </button>
      </div>
    </form>
  );
}
