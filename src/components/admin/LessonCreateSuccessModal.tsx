import Link from "next/link";

type Props = {
  open: boolean;
  createdLessonId: number | null;
  onGoToLessons: () => void;
};

export default function LessonCreateSuccessModal({
  open,
  createdLessonId,
  onGoToLessons,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lesson-create-success-title"
    >
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl ring-1 ring-black/5">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path
                fillRule="evenodd"
                d="M16.704 5.29a1 1 0 0 1 .006 1.415l-7.5 7.6a1 1 0 0 1-1.42.004L3.296 9.814a1 1 0 1 1 1.408-1.42l3.083 3.06 6.793-6.887a1 1 0 0 1 1.424.723Z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <div>
            <h2
              id="lesson-create-success-title"
              className="text-base font-semibold text-slate-900"
            >
              Lesson created
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Opening the editor to add parts, flashcards, and exercises…
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          {createdLessonId != null ? (
            <Link
              href={`/admin/lessons/${createdLessonId}`}
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-indigo-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Edit lesson
            </Link>
          ) : null}
          <button
            type="button"
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white py-2.5 text-center text-sm font-semibold text-slate-800 hover:bg-slate-50"
            onClick={onGoToLessons}
          >
            All lessons
          </button>
        </div>
      </div>
    </div>
  );
}
