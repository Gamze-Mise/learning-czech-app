import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";

interface PracticePageProps {
  params: Promise<{ id: string; lessonId: string }>;
}

export default async function PracticePage({ params }: PracticePageProps) {
  const { id: unitId, lessonId } = await params;

  // Fetch lesson with flashcards and exercises
  const lesson = await prisma.lesson.findUnique({
    where: { id: parseInt(lessonId) },
    include: {
      flashcards: true,
      exercises: true,
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
        title={`Practice: ${lesson.title}`}
        subtitle={lesson.description || "Practice your Czech skills"}
        className="py-8"
      />

      {/* Practice Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Flashcards Practice */}
        <Card>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Flashcard Practice
            </h3>
            <p className="text-gray-600 mb-4">
              Practice vocabulary with spaced repetition
            </p>
            <div className="text-sm text-gray-500 mb-4">
              {lesson.flashcards.length} cards available
            </div>
            <Button
              href={`/units/${unitId}/lessons/${lessonId}/flashcards`}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Start Flashcards
            </Button>
          </div>
        </Card>

        {/* Exercises Practice */}
        <Card>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Exercises</h3>
            <p className="text-gray-600 mb-4">
              Test your knowledge with interactive exercises
            </p>
            <div className="text-sm text-gray-500 mb-4">
              {lesson.exercises.length} exercises available
            </div>
            <Button
              href={`/units/${unitId}/lessons/${lessonId}/exercises`}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Start Exercises
            </Button>
          </div>
        </Card>
      </div>

      {/* Lesson Info */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Lesson Information
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xl font-bold text-blue-600">
              {lesson.estimatedTime}
            </div>
            <div className="text-xs text-blue-500">Minutes</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xl font-bold text-green-600">
              {lesson.flashcards.length}
            </div>
            <div className="text-xs text-green-500">Flashcards</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-xl font-bold text-purple-600">
              {lesson.exercises.length}
            </div>
            <div className="text-xs text-purple-500">Exercises</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-xl font-bold text-orange-600">
              {lesson.difficulty}
            </div>
            <div className="text-xs text-orange-500">Difficulty</div>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          href={`/units/${unitId}/lessons/${lessonId}`}
          variant="outline"
          className="flex-1"
        >
          Back to Lesson
        </Button>
        <Button href={`/units/${unitId}`} variant="outline" className="flex-1">
          Back to Unit
        </Button>
      </div>
    </div>
  );
}
