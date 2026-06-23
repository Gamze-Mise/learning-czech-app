"use client";

import { useParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/Button";
import Card from "@/components/Card";
import PageLoadingSpinner from "@/components/learner/PageLoadingSpinner";
import LearnerStatGrid from "@/components/learner/LearnerStatGrid";
import FlashcardFlipCard from "@/components/flashcards/FlashcardFlipCard";
import FlashcardSessionComplete from "@/components/flashcards/FlashcardSessionComplete";
import FlashcardDotProgress from "@/components/flashcards/FlashcardDotProgress";
import { useFlashcardSession } from "@/hooks/learner/useFlashcardSession";

export default function FlashcardsPage() {
  const params = useParams();
  const unitId = String(params.id);
  const lessonId = String(params.lessonId);
  const session = useFlashcardSession(unitId, lessonId);

  if (session.loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Loading Flashcards..."
          subtitle="Please wait while we load your flashcards"
        />
        <PageLoadingSpinner />
      </div>
    );
  }

  if (session.flashcards.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="No Flashcards Found"
          subtitle="This lesson doesn't have any flashcards yet"
        />
        <div className="text-center py-8">
          <Button href={`/units/${unitId}/lessons/${lessonId}`}>Back to Lesson</Button>
        </div>
      </div>
    );
  }

  if (session.isComplete) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <PageHeader
          title="Session Complete"
          subtitle={`You reviewed all ${session.flashcards.length} cards`}
        />
        <FlashcardSessionComplete
          unitId={unitId}
          lessonId={lessonId}
          totalCards={session.flashcards.length}
          knownCount={session.knownCount}
          againCount={session.againCount}
          exerciseCount={session.exerciseCount}
          onRestart={session.restartSession}
        />
      </div>
    );
  }

  if (!session.currentCard) {
    return (
      <div className="space-y-6">
        <PageHeader title="No Card Available" subtitle="There's an issue loading the current card" />
        <div className="text-center py-8">
          <Button href={`/units/${unitId}/lessons/${lessonId}`}>Back to Lesson</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Flashcard Practice"
        subtitle={`Card ${session.currentIndex + 1} of ${session.flashcards.length}`}
      />

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{
            width: `${((session.currentIndex + 1) / session.flashcards.length) * 100}%`,
          }}
        />
      </div>

      <div className="max-w-2xl mx-auto">
        <FlashcardFlipCard
          card={session.currentCard}
          isFlipped={session.isFlipped}
          savingProgress={session.savingProgress}
          onFlip={session.handleFlip}
          onKnown={() => void session.handleKnown()}
          onUnknown={() => void session.handleUnknown()}
        />
      </div>

      <FlashcardDotProgress
        total={session.flashcards.length}
        currentIndex={session.currentIndex}
        sessionRatings={session.sessionRatings}
        onJump={session.jumpToIndex}
        onPrevious={session.handlePrevious}
        onNext={session.handleNext}
      />

      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress</h3>
        <LearnerStatGrid
          items={[
            { value: session.flashcards.length, label: "Total Cards", theme: "blue" },
            { value: session.knownCount + session.againCount, label: "Reviewed", theme: "green" },
            { value: session.knownCount, label: "Got it", theme: "yellow" },
            {
              value: session.flashcards.length - session.currentIndex - 1,
              label: "Remaining",
              theme: "gray",
            },
          ]}
        />
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          href={`/units/${unitId}/lessons/${lessonId}/practice`}
          variant="outline"
          className="flex-1"
        >
          Back to Practice
        </Button>
        <Button href={`/units/${unitId}/lessons/${lessonId}`} variant="outline" className="flex-1">
          Back to Lesson
        </Button>
      </div>
    </div>
  );
}
