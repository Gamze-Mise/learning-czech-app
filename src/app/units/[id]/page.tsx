import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import Button from "@/components/Button";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function UnitPage({ params }: { params: { id: string } }) {
  const { id: unitId } = params;

  // Fetch unit with lessons from database
  const unit = await prisma.unit.findUnique({
    where: { id: parseInt(unitId) },
    include: {
      course: true,
      lessons: {
        include: {
          flashcards: true,
          exercises: true,
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!unit) {
    notFound();
  }

  // Calculate lesson progress (mock for now - later will be based on user progress)
  const lessonsWithProgress = unit.lessons.map((lesson: any) => ({
    ...lesson,
    progress: Math.floor(Math.random() * 100), // Mock progress
  }));

  return (
    <div className="space-y-6">
      {/* Unit Header */}
      <PageHeader
        title={unit.title}
        subtitle={
          unit.description ||
          "Choose a lesson to continue your learning journey"
        }
      />

      {/* Unit Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {unit.title}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{unit.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Level</div>
            <div className="text-lg font-bold text-blue-600">{unit.level}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xl font-bold text-blue-600">
              {unit.lessons.length}
            </div>
            <div className="text-xs text-blue-500">Lessons</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xl font-bold text-green-600">
              {unit.lessons.reduce(
                (sum: number, lesson: any) => sum + lesson.flashcards.length,
                0
              )}
            </div>
            <div className="text-xs text-green-500">Flashcards</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-xl font-bold text-purple-600">
              {unit.lessons.reduce(
                (sum: number, lesson: any) => sum + lesson.exercises.length,
                0
              )}
            </div>
            <div className="text-xs text-purple-500">Exercises</div>
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {lessonsWithProgress.map((lesson: any) => (
          <Card key={lesson.id} href={`/units/${unitId}/lessons/${lesson.id}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    lesson.type === "VOCABULARY"
                      ? "bg-blue-500"
                      : lesson.type === "GRAMMAR"
                      ? "bg-green-500"
                      : lesson.type === "CONVERSATION"
                      ? "bg-purple-500"
                      : lesson.type === "PRONUNCIATION"
                      ? "bg-orange-500"
                      : lesson.type === "CULTURE"
                      ? "bg-pink-500"
                      : "bg-gray-500"
                  }`}
                ></div>
                <span className="text-sm font-medium text-gray-600 capitalize">
                  {lesson.type.toLowerCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-blue-600">
                {lesson.progress}%
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
              {lesson.title}
            </h3>

            {lesson.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {lesson.description}
              </p>
            )}

            <ProgressBar
              label=""
              percentage={lesson.progress}
              color="blue"
              showPercentage={false}
              className="mb-4"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>{lesson.flashcards.length} cards</span>
                <span>{lesson.exercises.length} exercises</span>
                {lesson.estimatedTime && (
                  <span>{lesson.estimatedTime} min</span>
                )}
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

      {/* Back Button */}
      <div className="text-center">
        <Button href="/" variant="outline" className="inline-flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
