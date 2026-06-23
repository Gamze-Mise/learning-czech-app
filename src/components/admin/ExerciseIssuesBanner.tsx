import { autoFixExercise, findExerciseIssues } from "@/lib/exercises/admin-rules";

type Props = {
  type: string;
  answer: string;
  options: string;
  onAutoFix: (fixed: { answer: string; options: string }) => void;
};

export default function ExerciseIssuesBanner({ type, answer, options, onAutoFix }: Props) {
  const issues = findExerciseIssues(type, answer, options);
  if (!issues.length) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold">This exercise needs a quick fix</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-xs text-amber-900/90">
            {issues.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-lg bg-amber-200 px-3 py-1 text-xs font-semibold text-amber-950 hover:bg-amber-300"
          onClick={() => onAutoFix(autoFixExercise(type, answer, options))}
        >
          Auto-fix
        </button>
      </div>
    </div>
  );
}
