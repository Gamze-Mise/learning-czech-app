"use client";

import { useParams } from "next/navigation";
import Card from "@/components/Card";
import Button from "@/components/Button";
import PageLoadingSpinner from "@/components/learner/PageLoadingSpinner";
import LessonOverviewCard from "@/components/learner/LessonOverviewCard";
import LessonPartContent from "@/components/learner/LessonPartContent";
import VocabularyPreview from "@/components/learner/VocabularyPreview";
import { useLessonDetail } from "@/hooks/learner/useLessonDetail";
import { filterVisibleLessonParts } from "@/lib/lessons/parts";

export default function LessonPage() {
  const params = useParams();
  const unitId = params.id as string;
  const lessonId = params.lessonId as string;
  const { lesson, loading } = useLessonDetail(lessonId);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="py-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Loading...</h1>
          <p className="mt-1 text-gray-600">
            Please wait while we load the lesson
          </p>
        </div>
        <PageLoadingSpinner />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="space-y-6">
        <div className="py-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Lesson Not Found</h1>
          <p className="mt-1 text-gray-600">
            The lesson you&apos;re looking for doesn&apos;t exist
          </p>
        </div>
      </div>
    );
  }

  const visibleParts = filterVisibleLessonParts(lesson.parts ?? []);

  return (
    <div className="space-y-6">
      <LessonOverviewCard
        lesson={lesson}
        visiblePartsCount={visibleParts.length}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Lesson Content</h3>
        {visibleParts.map((part, index) => (
          <Card key={part.id}>
            <LessonPartContent
              part={part}
              index={index}
              unitId={unitId}
              lessonId={lessonId}
              lesson={lesson}
            />
          </Card>
        ))}
      </div>

      <VocabularyPreview
        flashcards={lesson.flashcards}
        unitId={unitId}
        lessonId={lessonId}
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          href={`/units/${unitId}/lessons/${lessonId}/practice`}
          variant="primary"
          size="lg"
          className="flex-1"
        >
          Start Practice
        </Button>
        <Button
          href={`/units/${unitId}`}
          variant="outline"
          size="lg"
          className="flex-1"
        >
          Back to Unit
        </Button>
      </div>
    </div>
  );
}
