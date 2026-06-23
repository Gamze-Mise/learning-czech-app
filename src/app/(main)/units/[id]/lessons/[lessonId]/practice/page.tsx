import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/Button";
import PracticeModeCard from "@/components/practice/PracticeModeCard";
import LessonPracticeStats from "@/components/practice/LessonPracticeStats";

export const dynamic = "force-dynamic";

interface PracticePageProps {
  params: Promise<{ id: string; lessonId: string }>;
}

export default async function PracticePage({ params }: PracticePageProps) {
  const { id: unitId, lessonId } = await params;

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
          {`The lesson you are looking for does not exist.`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Practice: ${lesson.title}`}
        subtitle={lesson.description || "Practice your Czech skills"}
        className="py-8"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PracticeModeCard
          title="Flashcard Practice"
          description="Practice vocabulary with spaced repetition"
          count={lesson.flashcards.length}
          countLabel="cards available"
          href={`/units/${unitId}/lessons/${lessonId}/flashcards`}
          buttonLabel="Start Flashcards"
          iconBgClass="bg-green-100"
          iconColorClass="text-green-600"
          icon={
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"></path>
            </svg>
          }
        />
        <PracticeModeCard
          title="Exercises"
          description="Test your knowledge with interactive exercises"
          count={lesson.exercises.length}
          countLabel="exercises available"
          href={`/units/${unitId}/lessons/${lessonId}/exercises`}
          buttonLabel="Start Exercises"
          iconBgClass="bg-purple-100"
          iconColorClass="text-purple-600"
          icon={
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          }
        />
      </div>

      <LessonPracticeStats
        estimatedTime={lesson.estimatedTime}
        flashcardCount={lesson.flashcards.length}
        exerciseCount={lesson.exercises.length}
        difficulty={lesson.difficulty}
      />

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
