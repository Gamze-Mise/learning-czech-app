"use client";

import AdminImageField from "@/components/admin/AdminImageField";
import AdminAudioField from "@/components/admin/AdminAudioField";
import { useMemo, useState } from "react";

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
  "TRANSLATION",
] as const;

type McqOption = { text: string; correct?: boolean };
type MatchingOption = { left: string; right: string };

function safeJsonParse(text: string): unknown {
  const t = String(text ?? "").trim();
  if (!t) return null;
  try {
    return JSON.parse(t);
  } catch {
    return null;
  }
}

function normalizeMcq(raw: unknown): McqOption[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((o: any) => ({
      text: typeof o?.text === "string" ? o.text : typeof o === "string" ? o : "",
      correct: Boolean(o?.correct),
    }))
    .filter((o) => o.text.trim().length > 0);
}

function normalizeMatching(raw: unknown): MatchingOption[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((o: any) => ({
      left: typeof o?.left === "string" ? o.left : "",
      right: typeof o?.right === "string" ? o.right : "",
    }))
    .filter((o) => o.left.trim().length > 0 || o.right.trim().length > 0);
}

function toJsonString(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function setSingleCorrect(options: McqOption[], idx: number): McqOption[] {
  return options.map((o, i) => ({ ...o, correct: i === idx }));
}

function needsMcqOptions(type: string): boolean {
  return type === "MCQ" || type === "LISTENING";
}

function needsFillAnswer(type: string): boolean {
  return type === "FILL" || type === "TRANSLATION";
}

function needsMatchingOptions(type: string): boolean {
  return type === "MATCHING";
}

function allowAudio(type: string): boolean {
  return type === "LISTENING";
}

function allowTimeLimit(type: string): boolean {
  // Matching is interaction-heavy; keep it untimed for now.
  return type !== "MATCHING";
}

function defaultOptionsFor(type: string): string {
  if (needsMcqOptions(type)) {
    return toJsonString([
      { text: "Option A", correct: true },
      { text: "Option B", correct: false },
    ]);
  }
  if (needsMatchingOptions(type)) {
    return toJsonString([{ left: "TODO", right: "TODO" }]);
  }
  return "";
}

function findExerciseIssues(type: string, answer: string, optionsText: string): string[] {
  const issues: string[] = [];
  const parsed = safeJsonParse(optionsText);

  if (needsFillAnswer(type) && !String(answer ?? "").trim()) {
    issues.push("Answer is required for this type.");
  }

  if (needsMcqOptions(type)) {
    const opts = normalizeMcq(parsed);
    if (opts.length < 2) issues.push("At least 2 choices are required.");
    const correctCount = opts.filter((o) => o.correct).length;
    if (correctCount !== 1) issues.push("Exactly 1 choice must be marked correct.");
  }

  if (needsMatchingOptions(type)) {
    const pairs = normalizeMatching(parsed);
    if (pairs.length < 1) issues.push("At least 1 pair is required.");
    const invalid = pairs.some(
      (p) => !String(p.left).trim() || !String(p.right).trim()
    );
    if (invalid) issues.push("Each pair must have non-empty left and right values.");
  }

  return issues;
}

function autoFixExercise(type: string, answer: string, optionsText: string): { answer: string; options: string } {
  const parsed = safeJsonParse(optionsText);

  if (needsMcqOptions(type)) {
    let opts = normalizeMcq(parsed);
    if (opts.length < 2) {
      opts = [
        { text: opts[0]?.text?.trim() ? opts[0].text : "Option A", correct: true },
        { text: "Option B", correct: false },
      ];
    }
    const firstCorrect = opts.findIndex((o) => o.correct);
    const idx = firstCorrect >= 0 ? firstCorrect : 0;
    opts = setSingleCorrect(opts, idx);
    return { answer: "", options: toJsonString(opts) };
  }

  if (needsMatchingOptions(type)) {
    let pairs = normalizeMatching(parsed);
    if (pairs.length < 1) pairs = [{ left: "TODO", right: "TODO" }];
    pairs = pairs.map((p) => ({
      left: String(p.left ?? "").trim() ? p.left : "TODO",
      right: String(p.right ?? "").trim() ? p.right : "TODO",
    }));
    return { answer: "", options: toJsonString(pairs) };
  }

  if (needsFillAnswer(type)) {
    const a = String(answer ?? "").trim() ? answer : "TODO";
    return { answer: a, options: "" };
  }

  return { answer: "", options: "" };
}

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

  function renderOptionsEditor(
    mode: "new" | "edit",
    type: string,
    optionsText: string,
    setOptionsText: (next: string) => void
  ) {
    const effectiveType = needsMcqOptions(type) ? "MCQ" : type;
    const parsed = safeJsonParse(optionsText);
    const mcq = normalizeMcq(parsed);
    const matching = normalizeMatching(parsed);

    if (effectiveType === "MCQ") {
      const opts = mcq.length ? mcq : [{ text: "Option A", correct: true }, { text: "Option B" }];
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-700">Choices</p>
            <button
              type="button"
              className="text-xs font-semibold text-indigo-700 hover:underline"
              onClick={() => {
                const next = [...opts, { text: "" }];
                setOptionsText(toJsonString(next));
              }}
            >
              + Add choice
            </button>
          </div>
          <div className="space-y-2">
            {opts.map((o, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={mode === "new" ? "new-mcq-correct" : "edit-mcq-correct"}
                  checked={Boolean(o.correct)}
                  onChange={() => setOptionsText(toJsonString(setSingleCorrect(opts, i)))}
                />
                <input
                  value={o.text}
                  onChange={(e) => {
                    const next = opts.map((x, idx) => (idx === i ? { ...x, text: e.target.value } : x));
                    setOptionsText(toJsonString(next));
                  }}
                  placeholder={`Choice ${i + 1}`}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
                />
                <button
                  type="button"
                  className="text-xs font-semibold text-rose-700 hover:underline"
                  onClick={() => {
                    const next = opts.filter((_, idx) => idx !== i);
                    const normalized = next.some((x) => x.correct) ? next : next.length ? [{ ...next[0], correct: true }, ...next.slice(1)] : [];
                    setOptionsText(toJsonString(normalized));
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500">
            Select the correct option with the radio button.
          </p>
        </div>
      );
    }

    if (type === "MATCHING") {
      const pairs = matching.length ? matching : [{ left: "", right: "" }];
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-700">Pairs</p>
            <button
              type="button"
              className="text-xs font-semibold text-indigo-700 hover:underline"
              onClick={() => setOptionsText(toJsonString([...pairs, { left: "", right: "" }]))}
            >
              + Add pair
            </button>
          </div>
          <div className="space-y-2">
            {pairs.map((p, i) => (
              <div key={i} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
                <input
                  value={p.left}
                  onChange={(e) => {
                    const next = pairs.map((x, idx) => (idx === i ? { ...x, left: e.target.value } : x));
                    setOptionsText(toJsonString(next));
                  }}
                  placeholder="Left"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
                />
                <input
                  value={p.right}
                  onChange={(e) => {
                    const next = pairs.map((x, idx) => (idx === i ? { ...x, right: e.target.value } : x));
                    setOptionsText(toJsonString(next));
                  }}
                  placeholder="Right"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
                />
                <button
                  type="button"
                  className="text-xs font-semibold text-rose-700 hover:underline"
                  onClick={() => setOptionsText(toJsonString(pairs.filter((_, idx) => idx !== i)))}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // No options needed for other types
    return null;
  }

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Exercises</h2>
          <p className="text-sm text-slate-600">
            Add exercises with images/audio; options are edited with a simple UI.
          </p>
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
                {findExerciseIssues(exDraft.type, exDraft.answer, exDraft.options).length ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold">This exercise needs a quick fix</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-5 text-xs text-amber-900/90">
                          {findExerciseIssues(exDraft.type, exDraft.answer, exDraft.options).map((m) => (
                            <li key={m}>{m}</li>
                          ))}
                        </ul>
                      </div>
                      <button
                        type="button"
                        className="shrink-0 rounded-lg bg-amber-200 px-3 py-1 text-xs font-semibold text-amber-950 hover:bg-amber-300"
                        onClick={() => {
                          const fixed = autoFixExercise(exDraft.type, exDraft.answer, exDraft.options);
                          setExDraft({
                            ...exDraft,
                            answer: fixed.answer,
                            options: fixed.options,
                          });
                        }}
                      >
                        Auto-fix
                      </button>
                    </div>
                  </div>
                ) : null}
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-600">
                    #{index + 1}
                  </div>
                  <select
                    value={exDraft.type}
                    onChange={(e) => {
                      const nextType = e.target.value;
                      const next: any = { ...exDraft, type: nextType };
                      if ((needsMcqOptions(nextType) || needsMatchingOptions(nextType)) && !String(exDraft.options ?? "").trim()) {
                        next.options = defaultOptionsFor(nextType);
                      }
                      if (!needsFillAnswer(nextType)) {
                        next.answer = "";
                      }
                      if (!allowAudio(nextType)) {
                        next.audioUrl = "";
                      }
                      if (!allowTimeLimit(nextType)) {
                        next.timeLimit = "";
                      }
                      setExDraft(next);
                    }}
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
                {renderOptionsEditor("edit", exDraft.type, exDraft.options, (next) =>
                  setExDraft({ ...exDraft, options: next })
                )}
                <div className="grid grid-cols-2 gap-2">
                  {needsFillAnswer(exDraft.type) ? (
                    <input
                      required
                      value={exDraft.answer}
                      onChange={(e) => setExDraft({ ...exDraft, answer: e.target.value })}
                      placeholder="Answer"
                      className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
                    />
                  ) : null}
                  <input
                    value={exDraft.points}
                    onChange={(e) => setExDraft({ ...exDraft, points: e.target.value })}
                    placeholder="Points"
                    className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
                  />
                  {allowTimeLimit(exDraft.type) ? (
                    <input
                      value={exDraft.timeLimit}
                      onChange={(e) => setExDraft({ ...exDraft, timeLimit: e.target.value })}
                      placeholder="Time limit"
                      className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
                    />
                  ) : null}
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
                {allowAudio(exDraft.type) ? (
                  <AdminAudioField
                    compact
                    label="Audio"
                    value={exDraft.audioUrl ?? ""}
                    onChange={(v) => setExDraft({ ...exDraft, audioUrl: v })}
                    enableFileUpload
                  />
                ) : null}
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
            onChange={(e) => {
              const nextType = e.target.value;
              setNewEx((prev) => {
                const next: NewExState = { ...prev, type: nextType };
                if ((needsMcqOptions(nextType) || needsMatchingOptions(nextType)) && !String(prev.options ?? "").trim()) {
                  next.options = defaultOptionsFor(nextType);
                }
                if (!needsFillAnswer(nextType)) {
                  next.answer = "";
                }
                if (!allowAudio(nextType)) {
                  next.audioUrl = "";
                }
                if (!allowTimeLimit(nextType)) {
                  next.timeLimit = "";
                }
                return next;
              });
            }}
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
          {renderOptionsEditor("new", newEx.type, newEx.options, (next) =>
            setNewEx({ ...newEx, options: next })
          )}
        </div>
        {needsFillAnswer(newEx.type) ? (
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Answer *</label>
            <input
              required
              value={newEx.answer}
              onChange={(e) => setNewEx({ ...newEx, answer: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>
        ) : null}
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
        {allowTimeLimit(newEx.type) ? (
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Time limit (s)</label>
            <input
              value={newEx.timeLimit}
              onChange={(e) => setNewEx({ ...newEx, timeLimit: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              placeholder="e.g. 60"
            />
          </div>
        ) : null}
        <div className="md:col-span-2">
          <AdminImageField
            compact
            label="Image"
            value={newEx.imageUrl}
            onChange={(v) => setNewEx({ ...newEx, imageUrl: v })}
            enableFileUpload
          />
        </div>
        {allowAudio(newEx.type) ? (
          <div className="md:col-span-2">
            <AdminAudioField
              label="Audio"
              value={newEx.audioUrl}
              onChange={(v) => setNewEx({ ...newEx, audioUrl: v })}
              enableFileUpload
            />
          </div>
        ) : null}
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
