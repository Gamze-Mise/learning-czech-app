import Card from "@/components/Card";
import CoverImage from "@/components/CoverImage";
import ProgressBar from "@/components/ProgressBar";
import { getLessonTypeColor, getProgressColor } from "@/lib/learner/display";
import type { LessonSummary } from "@/lib/learner/types";

type Props = {
  lessons: LessonSummary[];
  unitId: string;
};

export default function UnitLessonGrid({ lessons, unitId }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {lessons.map((lesson) => (
        <Card key={lesson.id} href={`/units/${unitId}/lessons/${lesson.id}`}>
          <div className="-mt-4 -mx-4 sm:-mt-6 sm:-mx-6 mb-4">
            <CoverImage
              src={lesson.thumbnail}
              alt={`${lesson.title} cover`}
              title={lesson.title}
              aspectClassName="aspect-[16/9]"
              fit="contain"
              className="rounded-t-xl rounded-b-none border-b-0"
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${getLessonTypeColor(
                  lesson.type
                )}`}
              />
              <span className="text-sm font-medium text-gray-600 capitalize">
                {lesson.type.toLowerCase()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {lesson.isCompleted ? (
                <span className="text-green-600 text-sm">✓</span>
              ) : null}
              <span className="text-sm font-medium text-blue-600">
                {lesson.progress}%
              </span>
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
            {lesson.title}
          </h3>

          {lesson.description ? (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {lesson.description}
            </p>
          ) : null}

          <ProgressBar
            label=""
            percentage={lesson.progress}
            color={getProgressColor(lesson.progress)}
            showPercentage={false}
            className="mb-4"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>{lesson.flashcards.length} cards</span>
              <span>
                {lesson.completedExercises}/{lesson.totalExercises} exercises
              </span>
              {lesson.estimatedTime ? (
                <span>{lesson.estimatedTime} min</span>
              ) : null}
            </div>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </Card>
      ))}
    </div>
  );
}
