"use client";

import { needsMcqOptions } from "@/lib/exercises/admin-rules";
import {
  normalizeMatching,
  normalizeMcq,
  safeJsonParse,
  setSingleCorrect,
  toJsonString,
} from "@/lib/exercises/options";

type Props = {
  mode: "new" | "edit";
  type: string;
  optionsText: string;
  onChange: (next: string) => void;
};

export default function ExerciseOptionsEditor({ mode, type, optionsText, onChange }: Props) {
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
            onClick={() => onChange(toJsonString([...opts, { text: "" }]))}
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
                onChange={() => onChange(toJsonString(setSingleCorrect(opts, i)))}
              />
              <input
                value={o.text}
                onChange={(e) => {
                  const next = opts.map((x, idx) =>
                    idx === i ? { ...x, text: e.target.value } : x
                  );
                  onChange(toJsonString(next));
                }}
                placeholder={`Choice ${i + 1}`}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
              />
              <button
                type="button"
                className="text-xs font-semibold text-rose-700 hover:underline"
                onClick={() => {
                  const next = opts.filter((_, idx) => idx !== i);
                  const normalized = next.some((x) => x.correct)
                    ? next
                    : next.length
                      ? [{ ...next[0], correct: true }, ...next.slice(1)]
                      : [];
                  onChange(toJsonString(normalized));
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
            onClick={() => onChange(toJsonString([...pairs, { left: "", right: "" }]))}
          >
            + Add pair
          </button>
        </div>
        <div className="space-y-2">
          {pairs.map((p, i) => (
            <div
              key={i}
              className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-center"
            >
              <input
                value={p.left}
                onChange={(e) => {
                  const next = pairs.map((x, idx) =>
                    idx === i ? { ...x, left: e.target.value } : x
                  );
                  onChange(toJsonString(next));
                }}
                placeholder="Left"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
              />
              <input
                value={p.right}
                onChange={(e) => {
                  const next = pairs.map((x, idx) =>
                    idx === i ? { ...x, right: e.target.value } : x
                  );
                  onChange(toJsonString(next));
                }}
                placeholder="Right"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
              />
              <button
                type="button"
                className="text-xs font-semibold text-rose-700 hover:underline"
                onClick={() => onChange(toJsonString(pairs.filter((_, idx) => idx !== i)))}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
