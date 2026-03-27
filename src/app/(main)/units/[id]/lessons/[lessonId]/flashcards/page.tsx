"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";

const USER_ID = 1; // TODO: replace with real auth

interface Flashcard {
  id: number;
  frontText: string;
  backText: string;
  audioUrl: string | null;
  imageUrl: string | null;
  example: string | null;
  difficulty: number;
  category: string;
  tags: string[];
}

export default function FlashcardsPage() {
  const params = useParams();
  const { id: unitId, lessonId } = params;

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingProgress, setSavingProgress] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [sessionRatings, setSessionRatings] = useState<
    { index: number; result: "known" | "unknown" }[]
  >([]);
  const cardSeenAtRef = useRef<number | null>(null);

  const fetchFlashcards = useCallback(async () => {
    try {
      const response = await fetch(`/api/flashcards/${lessonId}`);
      if (response.ok) {
        const data = await response.json();
        setFlashcards(data.flashcards || []);
      }
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    void fetchFlashcards();
  }, [fetchFlashcards]);

  const handleFlip = () => {
    if (!isFlipped) cardSeenAtRef.current = Date.now();
    setIsFlipped((prev) => !prev);
  };

  const studyTimeSeconds = () => {
    if (!cardSeenAtRef.current) return 0;
    return Math.round((Date.now() - cardSeenAtRef.current) / 1000);
  };

  const reportProgress = async (result: "known" | "unknown") => {
    const card = flashcards[currentIndex];
    if (!card || savingProgress) return;
    setSavingProgress(true);
    try {
      await fetch("/api/flashcards/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: USER_ID,
          flashcardId: card.id,
          result,
          studyTimeSeconds: studyTimeSeconds(),
        }),
      });
    } catch (e) {
      console.error("Error saving flashcard progress:", e);
    } finally {
      setSavingProgress(false);
    }
  };

  const handleKnown = async () => {
    if (!isFlipped) return;

    await reportProgress("known");
    setSessionRatings((prev) => {
      const filtered = prev.filter((r) => r.index !== currentIndex);
      return [...filtered, { index: currentIndex, result: "known" }];
    });
    const isLast = currentIndex === flashcards.length - 1;

    if (isLast) {
      setIsComplete(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setIsFlipped(false);
    cardSeenAtRef.current = null;
  };

  const handleUnknown = async () => {
    if (!isFlipped) return;

    await reportProgress("unknown");
    setSessionRatings((prev) => {
      const filtered = prev.filter((r) => r.index !== currentIndex);
      return [...filtered, { index: currentIndex, result: "unknown" }];
    });
    const isLast = currentIndex === flashcards.length - 1;

    if (isLast) {
      setIsComplete(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setIsFlipped(false);
    cardSeenAtRef.current = null;
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
      cardSeenAtRef.current = null;
      setIsComplete(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
      cardSeenAtRef.current = null;
      setIsComplete(false);
    }
  };

  const playAudio = () => {
    if (flashcards[currentIndex]?.audioUrl) {
      const audio = new Audio(flashcards[currentIndex].audioUrl!);
      audio.play().catch(console.error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Loading Flashcards..."
          subtitle="Please wait while we load your flashcards"
        />
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="No Flashcards Found"
          subtitle="This lesson doesn't have any flashcards yet"
        />
        <div className="text-center py-8">
          <Button href={`/units/${unitId}/lessons/${lessonId}`}>
            Back to Lesson
          </Button>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  if (!currentCard) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="No Card Available"
          subtitle="There's an issue loading the current card"
        />
        <div className="text-center py-8">
          <Button href={`/units/${unitId}/lessons/${lessonId}`}>
            Back to Lesson
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Flashcard Practice"
        subtitle={`Card ${currentIndex + 1} of ${flashcards.length}`}
      />

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / flashcards.length) * 100}%`,
          }}
        ></div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="min-h-96">
          <div
            className="relative h-96 cursor-pointer"
            onClick={handleFlip}
            aria-label="Flip card"
          >
            <div
              className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
                isFlipped ? "rotate-y-180" : ""
              }`}
              style={{ 
                transformStyle: "preserve-3d",
                perspective: "1000px"
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(0deg)",
                }}
              >
                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="mb-4">
                    {currentCard.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element -- remote lesson URLs
                      <img
                        src={currentCard.imageUrl}
                        alt="Flashcard"
                        className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Crect width='128' height='128' fill='%23e5e7eb'/%3E%3Ctext x='64' y='64' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='14' fill='%23374151'%3EImage%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    )}
                  </div>

                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    {currentCard.frontText}
                  </h2>

                  {currentCard.audioUrl && (
                    <button
                      onClick={playAudio}
                      className="p-3 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      🔊 Play Audio
                    </button>
                  )}

                  <p className="mt-6 text-sm text-gray-500">
                    Tap the card to flip and see the answer.
                  </p>
                </div>
              </div>

              <div
                className="absolute inset-0"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-blue-50">
                  <h2 className="text-3xl font-bold text-blue-800 mb-4">
                    {currentCard.backText}
                  </h2>

                  {currentCard.example && (
                    <div className="bg-white rounded-lg p-4 mb-6 max-w-md">
                      <p className="text-gray-600 italic">
                        {`“${currentCard.example}”`}
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-2 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {currentCard.category}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      Level {currentCard.difficulty}
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-blue-700">
                    Decide how well you knew this card.
                  </p>

                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Button
                      onClick={handleUnknown}
                      variant="secondary"
                      size="md"
                      disabled={savingProgress}
                      className="bg-red-50 text-red-700 hover:bg-red-100"
                    >
                      Again
                    </Button>
                    <Button
                      onClick={handleKnown}
                      variant="primary"
                      size="md"
                      disabled={savingProgress}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Got it
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      {isComplete && (
        <Card>
          <div className="text-center space-y-3">
            <h3 className="text-xl font-bold text-gray-800">
              Great job! You&apos;ve completed all cards for this session.
            </h3>
            <p className="text-sm text-gray-600">
              You can review again or go back to the lesson whenever you like.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setCurrentIndex(0);
                  setIsFlipped(false);
                  cardSeenAtRef.current = null;
                  setIsComplete(false);
                  setSessionRatings([]);
                }}
              >
                Review cards again
              </Button>
              <Button href={`/units/${unitId}/lessons/${lessonId}`}>
                Back to Lesson
              </Button>
              <Button
                href={`/units/${unitId}/lessons/${lessonId}/practice`}
                variant="outline"
              >
                Back to Practice
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-center items-center space-x-4">
        <Button
          onClick={handlePrevious}
          variant="outline"
          disabled={currentIndex === 0}
        >
          ← Previous
        </Button>

        <div className="flex space-x-2">
          {flashcards.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsFlipped(false);
                cardSeenAtRef.current = null;
                setIsComplete(false);
              }}
              className={`w-3 h-3 rounded-full transition-colors ${
                (() => {
                  const rating = sessionRatings.find(
                    (r) => r.index === index
                  );
                  if (rating?.result === "known") return "bg-green-500";
                  if (rating?.result === "unknown") return "bg-red-400";
                  return index === currentIndex ? "bg-blue-600" : "bg-gray-300";
                })()
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          variant="outline"
          disabled={currentIndex === flashcards.length - 1}
        >
          Next →
        </Button>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xl font-bold text-blue-600">
              {flashcards.length}
            </div>
            <div className="text-xs text-blue-500">Total Cards</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xl font-bold text-green-600">
              {currentIndex}
            </div>
            <div className="text-xs text-green-500">Completed</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="text-xl font-bold text-yellow-600">
              {currentIndex === flashcards.length - 1 ? 1 : 0}
            </div>
            <div className="text-xs text-yellow-500">Current</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xl font-bold text-gray-600">
              {flashcards.length - currentIndex - 1}
            </div>
            <div className="text-xs text-gray-500">Remaining</div>
          </div>
        </div>
      </Card>

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
