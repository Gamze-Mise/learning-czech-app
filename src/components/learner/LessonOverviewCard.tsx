import LearnerHeroMedia from "@/components/learner/LearnerHeroMedia";
import LearnerStatGrid from "@/components/learner/LearnerStatGrid";
import type { LessonDetail } from "@/lib/learner/types";

type Props = {
  lesson: LessonDetail;
  visiblePartsCount: number;
};

function DifficultyBadge({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200/60">
      <span aria-hidden>★</span>
      <span>
        Level {level}
        <span className="sr-only"> out of 5</span>
      </span>
    </span>
  );
}

function TimeBadge({ minutes }: { minutes: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
      <svg
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {minutes} min
    </span>
  );
}

export default function LessonOverviewCard({
  lesson,
  visiblePartsCount,
}: Props) {
  const estimatedTime = lesson.estimatedTime || 0;

  return (
    <section
      aria-label="Lesson overview"
      className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        <LearnerHeroMedia
          src={lesson.thumbnail}
          alt={`${lesson.title} cover`}
          title={lesson.title}
        />

        <div className="flex min-w-0 flex-1 flex-col justify-center items-center sm:items-start text-center sm:text-left gap-4 p-5 sm:p-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {lesson.title}
            </h1>
            {lesson.description ? (
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600 line-clamp-2 sm:line-clamp-3">
                {lesson.description}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <DifficultyBadge level={lesson.difficulty} />
            {estimatedTime > 0 ? <TimeBadge minutes={estimatedTime} /> : null}
          </div>

          <LearnerStatGrid
            columns={3}
            className="w-full max-w-md sm:max-w-none"
            items={[
              { value: visiblePartsCount, label: "Parts", theme: "blue" },
              {
                value: lesson.flashcards.length,
                label: "Flashcards",
                theme: "green",
              },
              {
                value: lesson.exercises.length,
                label: "Exercises",
                theme: "purple",
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
