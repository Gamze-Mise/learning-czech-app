import ProgressBar from "@/components/ProgressBar";
import LearnerHeroMedia from "@/components/learner/LearnerHeroMedia";
import LearnerStatGrid from "@/components/learner/LearnerStatGrid";
import { getProgressColor } from "@/lib/learner/display";
import type { UnitWithProgress } from "@/lib/learner/types";

type Props = {
  unit: UnitWithProgress;
};

function LevelBadge({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800 ring-1 ring-blue-200/60">
      Unit Level {level}
    </span>
  );
}

export default function UnitOverviewCard({ unit }: Props) {
  const totalFlashcards = unit.lessons.reduce(
    (sum, lesson) => sum + lesson.flashcards.length,
    0
  );
  const totalExercises = unit.lessons.reduce(
    (sum, lesson) => sum + lesson.exercises.length,
    0
  );

  return (
    <section
      aria-label="Unit overview"
      className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        <LearnerHeroMedia
          src={unit.thumbnail}
          alt={`${unit.title} cover`}
          title={unit.title}
        />

        <div className="flex min-w-0 flex-1 flex-col justify-center items-center sm:items-start text-center sm:text-left gap-4 p-5 sm:p-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {unit.title}
            </h1>
            {unit.description ? (
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600 line-clamp-2 sm:line-clamp-3">
                {unit.description}
              </p>
            ) : null}
          </div>

          <LevelBadge level={unit.level} />

          <div className="w-full max-w-md sm:max-w-none space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-slate-700">Unit Progress</span>
              <span className="text-slate-600">
                {unit.completedLessons}/{unit.totalLessons} lessons
              </span>
            </div>
            <ProgressBar
              label=""
              percentage={unit.progress}
              color={getProgressColor(unit.progress)}
              showPercentage={true}
            />
          </div>

          <LearnerStatGrid
            columns={3}
            className="w-full max-w-md sm:max-w-none"
            items={[
              { value: unit.lessons.length, label: "Lessons", theme: "blue" },
              { value: totalFlashcards, label: "Flashcards", theme: "green" },
              { value: totalExercises, label: "Exercises", theme: "purple" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
