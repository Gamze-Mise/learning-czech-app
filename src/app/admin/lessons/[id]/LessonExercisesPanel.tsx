"use client";

import AdminImageField from "@/components/admin/AdminImageField";
import AdminAudioField from "@/components/admin/AdminAudioField";
import { useState } from "react";

export type NewExState = {
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
};

const EX_TYPES = [
  "MCQ",
  "FILL",
  "MATCHING",
  "LISTENING",
  "SPEAKING",
  "TRANSLATION",
  "ORDERING",
] as const;

type Props = {
  exercises: any[];
  busyEx: boolean;
  newEx: NewExState;
  setNewEx: React.Dispatch<React.SetStateAction<NewExState>>;
  editingExId: number | null;
  exDraft: any | null;
  setExDraft: React.Dispatch<React.SetStateAction<any | null>>;
  onAddExercise: (e: React.FormEvent) => void;
  onDeactivateExercise: (id: number) => void;
  onStartEditExercise: (ex: any) => void;
  onSaveExercise: (id: number) => void;
  onCancelEditExercise: () => void;
  onReorderExercise: (exerciseId: number, targetIndex: number) => void;
};

export default function LessonExercisesPanel({
  exercises,
  busyEx,
  newEx,
  setNewEx,
  editingExId,
  exDraft,
  setExDraft,
  onAddExercise,
  onDeactivateExercise,
  onStartEditExercise,
  onSaveExercise,
  onCancelEditExercise,
  onReorderExercise,
}: Props) {
  const [draggingId, setDraggingId] = useState<number | null>(null);

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Exercises</h2>
          <p className="text-sm text-slate-600">Question + JSON options (for MCQ/MATCHING).</p>
        </div>
        <span className="text-sm text-slate-500">{exercises.length} total</span>
      </div>

      <div className="space-y-2">
        {exercises.map((ex: any, index: number) => (
          <div
            key={ex.id}
            draggable={editingExId == null}
            onDragStart={() => setDraggingId(ex.id)}
            onDragEnd={() => setDraggingId(null)}
            onDragOver={(e) => {
              if (draggingId == null || draggingId === ex.id) return;
              e.preventDefault();
            }}
            onDrop={(e) => {
              if (draggingId == null || draggingId === ex.id) return;
              e.preventDefault();
              onReorderExercise(draggingId, index);
              setDraggingId(null);
            }}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
          >
            {editingExId === ex.id && exDraft ? (
              <div className="w-full space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-600">
                    #{index + 1}
                  </div>
                  <select
                    value={exDraft.type}
                    onChange={(e) => setExDraft({ ...exDraft, type: e.target.value })}
                    className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
                  >
                    {EX_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <input
                    value={exDraft.difficulty}
                    onChange={(e) => setExDraft({ ...exDraft, difficulty: e.target.value })}
                    placeholder="diff"
                    className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
                  />
                </div>
                <textarea
                  value={exDraft.question}
                  onChange={(e) => setExDraft({ ...exDraft, question: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
                />
                <textarea
                  value={exDraft.options}
                  onChange={(e) => setExDraft({ ...exDraft, options: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1 font-mono text-xs text-slate-900"
                  placeholder="Options JSON"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={exDraft.answer}
                    onChange={(e) => setExDraft({ ...exDraft, answer: e.target.value })}
                    placeholder="Answer"
                    className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
                  />
                  <input
                    value={exDraft.points}
                    onChange={(e) => setExDraft({ ...exDraft, points: e.target.value })}
                    placeholder="Points"
                    className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
                  />
                  <input
                    value={exDraft.timeLimit}
                    onChange={(e) => setExDraft({ ...exDraft, timeLimit: e.target.value })}
                    placeholder="Time limit"
                    className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
                  />
                  <div className="col-span-2">
                    <AdminImageField
                      compact
                      label="Image"
                      value={exDraft.imageUrl ?? ""}
                      onChange={(v) => setExDraft({ ...exDraft, imageUrl: v })}
                      enableFileUpload
                    />
                  </div>
                </div>
                <AdminAudioField
                  compact
                  label="Audio"
                  value={exDraft.audioUrl ?? ""}
                  onChange={(v) => setExDraft({ ...exDraft, audioUrl: v })}
                  enableFileUpload
                />
                <textarea
                  value={exDraft.explanation}
                  onChange={(e) => setExDraft({ ...exDraft, explanation: e.target.value })}
                  rows={2}
                  placeholder="Explanation"
                  className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
                />
                <label className="flex items-center gap-2 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={exDraft.isActive}
                    onChange={(e) => setExDraft({ ...exDraft, isActive: e.target.checked })}
                  />
                  Active
                </label>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onCancelEditExercise}
                    className="text-xs font-semibold text-slate-600 hover:underline"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={busyEx}
                    onClick={() => onSaveExercise(ex.id)}
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
                    {index + 1}. [{ex.type}] {ex.question}
                  </div>
                  <div className="text-xs text-slate-600">
                    {ex.points} XP • diff {ex.difficulty}{" "}
                    {ex.timeLimit ? `• ${ex.timeLimit}s` : ""}{" "}
                    {!ex.isActive ? "• Inactive" : ""}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={busyEx}
                    onClick={() => onStartEditExercise(ex)}
                    className="text-xs font-semibold text-indigo-700 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={busyEx}
                    onClick={() => onDeactivateExercise(ex.id)}
                    className="text-xs font-semibold text-rose-700 hover:underline"
                  >
                    Deactivate
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {exercises.length === 0 && <p className="text-sm text-slate-500">No exercises yet.</p>}
      </div>

      <form onSubmit={onAddExercise} className="grid grid-cols-1 gap-3 pt-2 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">Type</label>
          <select
            value={newEx.type}
            onChange={(e) => setNewEx({ ...newEx, type: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          >
            {EX_TYPES.map((t) => (
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
            value={newEx.question}
            onChange={(e) => setNewEx({ ...newEx, question: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-slate-700">Options (JSON)</label>
          <textarea
            value={newEx.options}
            onChange={(e) => setNewEx({ ...newEx, options: e.target.value })}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs text-slate-900"
            placeholder='For MCQ: [{"text":"A","correct":true},{"text":"B","correct":false}]\nFor MATCHING: [{"left":"ahoj","right":"hello"}]'
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">Answer</label>
          <input
            value={newEx.answer}
            onChange={(e) => setNewEx({ ...newEx, answer: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">Points</label>
          <input
            value={newEx.points}
            onChange={(e) => setNewEx({ ...newEx, points: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">Difficulty</label>
          <input
            value={newEx.difficulty}
            onChange={(e) => setNewEx({ ...newEx, difficulty: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">Time limit (s)</label>
          <input
            value={newEx.timeLimit}
            onChange={(e) => setNewEx({ ...newEx, timeLimit: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            placeholder="e.g. 60"
          />
        </div>
        <div className="md:col-span-2">
          <AdminImageField
            compact
            label="Image"
            value={newEx.imageUrl}
            onChange={(v) => setNewEx({ ...newEx, imageUrl: v })}
            enableFileUpload
          />
        </div>
        <div className="md:col-span-2">
          <AdminAudioField
            label="Audio"
            value={newEx.audioUrl}
            onChange={(v) => setNewEx({ ...newEx, audioUrl: v })}
            enableFileUpload
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-slate-700">Explanation</label>
          <textarea
            value={newEx.explanation}
            onChange={(e) => setNewEx({ ...newEx, explanation: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={busyEx}
            className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {busyEx ? "Saving…" : "Add exercise"}
          </button>
        </div>
      </form>
    </div>
  );
}
