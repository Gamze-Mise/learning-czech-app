import Button from "@/components/Button";
import type { ExerciseFeedbackModalState } from "@/hooks/learner/useExerciseSession";

type Props = {
  modal: ExerciseFeedbackModalState;
  cycle: 1 | 2;
  progress: { current: number; total: number };
  points: number;
  onNext: () => void;
};

export default function ExerciseFeedbackModal({
  modal,
  cycle,
  progress,
  points,
  onNext,
}: Props) {
  if (!modal.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

      <div className="relative w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
        <div
          className={`px-5 sm:px-6 py-4 border-b ${
            modal.kind === "correct"
              ? "bg-gradient-to-r from-emerald-50 to-emerald-100/40 border-emerald-200"
              : modal.kind === "reveal"
                ? "bg-gradient-to-r from-indigo-50 to-indigo-100/40 border-indigo-200"
                : "bg-gradient-to-r from-rose-50 to-rose-100/40 border-rose-200"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                  modal.kind === "correct"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : modal.kind === "reveal"
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                      : "bg-rose-50 border-rose-200 text-rose-700"
                }`}
              >
                <span className="text-xl">
                  {modal.kind === "correct" ? "✓" : modal.kind === "reveal" ? "💡" : "✕"}
                </span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
                  {modal.kind === "correct"
                    ? "Correct"
                    : modal.kind === "wrong"
                      ? "Try again later"
                      : "Answer"}
                </h3>
                <p className="text-sm text-slate-700">
                  {modal.kind === "correct"
                    ? `+${points} XP`
                    : modal.kind === "wrong"
                      ? cycle === 2
                        ? "Second attempt"
                        : "You’ll see this one again"
                      : "Second wrong — here’s the solution"}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-semibold text-slate-600">
                {cycle === 2 ? "Review" : "Session"}
              </div>
              <div className="text-xs text-slate-500">
                {progress.current} / {progress.total}
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 sm:px-6 py-5 sm:py-6 space-y-3">
          {modal.kind === "reveal" ? (
            <>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="text-xs font-semibold text-emerald-700">Correct answer</div>
                <div className="text-lg font-extrabold text-emerald-800 mt-1">
                  {modal.correctAnswer}
                </div>
              </div>
              {modal.explanation ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-semibold text-slate-600">Explanation</div>
                  <div className="text-sm text-slate-800 mt-1 leading-relaxed">
                    {modal.explanation}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-slate-700">
              {modal.kind === "correct"
                ? "Nice. Keep going."
                : "No worries — you’ll get another chance at the end."}
            </p>
          )}
        </div>

        <div className="px-5 sm:px-6 py-4 border-t border-slate-200 bg-white">
          <Button
            onClick={onNext}
            variant="primary"
            className={`w-full !rounded-2xl !font-semibold !py-3 shadow-sm ${
              modal.kind === "correct"
                ? "!bg-emerald-600 hover:!bg-emerald-700"
                : modal.kind === "reveal"
                  ? "!bg-indigo-600 hover:!bg-indigo-700"
                  : "!bg-rose-600 hover:!bg-rose-700"
            }`}
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
}
