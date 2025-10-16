import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";

interface ExercisesPageProps {
  params: { id: string; lessonId: string };
}

export default async function ExercisesPage({
  params,
  searchParams,
}: {
  params: { id: string; lessonId: string };
  searchParams?: { completed?: string };
}) {
  const { id: unitId, lessonId } = await params;
  const completed = searchParams?.completed === "true";

  // Fetch lesson with exercises
  const lesson = await prisma.lesson.findUnique({
    where: { id: parseInt(lessonId) },
    include: {
      exercises: {
        orderBy: { order: "asc" },
      },
      unit: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!lesson) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Lesson Not Found
        </h1>
        <p className="text-gray-600">
          The lesson you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={`Exercises: ${lesson.title}`}
        subtitle={`Complete ${lesson.exercises.length} interactive exercises`}
        className="py-8"
      />

      {/* Completion Message */}
      {completed && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-xl font-bold text-green-800 mb-2">
            Congratulations!
          </h3>
          <p className="text-green-700 mb-4">
            You've completed all exercises in this lesson!
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              href={`/units/${unitId}/lessons/${lessonId}`}
              variant="primary"
            >
              Back to Lesson
            </Button>
            <Button href={`/units/${unitId}`} variant="outline">
              Back to Unit
            </Button>
          </div>
        </div>
      )}

      {/* Exercise List */}
      <div className="space-y-4">
        {lesson.exercises.map((exercise, index) => (
          <Card key={exercise.id}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Exercise {exercise.order}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Type: {exercise.type} | Difficulty: {exercise.difficulty}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Type</div>
                <div className="text-sm font-medium text-blue-600 capitalize">
                  {exercise.type}
                </div>
              </div>
            </div>

            {/* Exercise Preview */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Question:
              </div>
              <div className="text-gray-800 mb-3">{exercise.question}</div>

              {exercise.type === "MCQ" && exercise.options && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">
                    Options:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Array.isArray(exercise.options) &&
                      exercise.options.map((option: any, optIndex: number) => (
                        <div
                          key={optIndex}
                          className="bg-white border border-gray-200 rounded p-2 text-sm"
                        >
                          {typeof option === "string"
                            ? option
                            : option.text || option}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {exercise.difficulty} difficulty
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {exercise.points} points
                </span>
              </div>
              <Button
                href={`/units/${unitId}/lessons/${lessonId}/exercises/${exercise.id}`}
                variant="primary"
                size="sm"
              >
                Start Exercise
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Exercise Stats */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Exercise Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xl font-bold text-blue-600">
              {lesson.exercises.length}
            </div>
            <div className="text-xs text-blue-500">Total Exercises</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xl font-bold text-green-600">0</div>
            <div className="text-xs text-green-500">Completed</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="text-xl font-bold text-yellow-600">0</div>
            <div className="text-xs text-yellow-500">In Progress</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xl font-bold text-gray-600">0</div>
            <div className="text-xs text-gray-500">Not Started</div>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          href={`/units/${unitId}/lessons/${lessonId}/practice`}
          variant="outline"
          className="flex-1"
        >
          Back to Practice
        </Button>
        <Button
          href={`/units/${unitId}/lessons/${lessonId}`}
          variant="outline"
          className="flex-1"
        >
          Back to Lesson
        </Button>
      </div>
    </div>
  );
}
