"use client";

import AdminImageField from "@/components/admin/AdminImageField";
import AdminAudioField from "@/components/admin/AdminAudioField";
import ExerciseIssuesBanner from "@/components/admin/ExerciseIssuesBanner";
import ExerciseOptionsEditor from "@/components/admin/ExerciseOptionsEditor";
import {
  allowExerciseAudio,
  allowExerciseTimeLimit,
  applyExerciseTypeChange,
  needsFillAnswer,
} from "@/lib/exercises/admin-rules";
import { EXERCISE_TYPES } from "@/lib/exercises/types";

type ExerciseDraft = {
  type: string;
  question: string;
  options: string;
  answer: string;
  explanation: string;
  points: string;
  difficulty: string;
  timeLimit: string;
  audioUrl: string;
  imageUrl: string;
  isActive: boolean;
};

type Props = {
  index: number;
  draft: ExerciseDraft;
  busy: boolean;
  onChange: (next: ExerciseDraft) => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function ExerciseEditForm({
  index,
  draft,
  busy,
  onChange,
  onSave,
  onCancel,
}: Props) {
  return (
    <div className="w-full space-y-2">
      <ExerciseIssuesBanner
        type={draft.type}
        answer={draft.answer}
        options={draft.options}
        onAutoFix={(fixed) =>
          onChange({
            ...draft,
            answer: fixed.answer,
            options: fixed.options,
          })
        }
      />
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-600">
          #{index + 1}
        </div>
        <select
          value={draft.type}
          onChange={(e) => onChange(applyExerciseTypeChange(draft, e.target.value))}
          className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
        >
          {EXERCISE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          value={draft.difficulty}
          onChange={(e) => onChange({ ...draft, difficulty: e.target.value })}
          placeholder="diff"
          className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
        />
      </div>
      <textarea
        value={draft.question}
        onChange={(e) => onChange({ ...draft, question: e.target.value })}
        rows={2}
        className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
      />
      <ExerciseOptionsEditor
        mode="edit"
        type={draft.type}
        optionsText={draft.options}
        onChange={(next) => onChange({ ...draft, options: next })}
      />
      <div className="grid grid-cols-2 gap-2">
        {needsFillAnswer(draft.type) ? (
          <input
            required
            value={draft.answer}
            onChange={(e) => onChange({ ...draft, answer: e.target.value })}
            placeholder="Answer"
            className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
          />
        ) : null}
        <input
          value={draft.points}
          onChange={(e) => onChange({ ...draft, points: e.target.value })}
          placeholder="Points"
          className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
        />
        {allowExerciseTimeLimit(draft.type) ? (
          <input
            value={draft.timeLimit}
            onChange={(e) => onChange({ ...draft, timeLimit: e.target.value })}
            placeholder="Time limit"
            className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
          />
        ) : null}
        <div className="col-span-2">
          <AdminImageField
            compact
            label="Image"
            value={draft.imageUrl ?? ""}
            onChange={(v) => onChange({ ...draft, imageUrl: v })}
            enableFileUpload
          />
        </div>
      </div>
      {allowExerciseAudio(draft.type) ? (
        <AdminAudioField
          compact
          label="Audio"
          value={draft.audioUrl ?? ""}
          onChange={(v) => onChange({ ...draft, audioUrl: v })}
          enableFileUpload
        />
      ) : null}
      <textarea
        value={draft.explanation}
        onChange={(e) => onChange({ ...draft, explanation: e.target.value })}
        rows={2}
        placeholder="Explanation"
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
