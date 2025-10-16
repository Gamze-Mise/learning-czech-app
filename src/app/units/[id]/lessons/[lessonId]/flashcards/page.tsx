"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";

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
  const router = useRouter();
  const { id: unitId, lessonId } = params;

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    fetchFlashcards();
  }, [lessonId]);

  const fetchFlashcards = async () => {
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
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(!showAnswer);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setShowAnswer(false);
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
      {/* Header */}
      <PageHeader
        title="Flashcard Practice"
        subtitle={`Card ${currentIndex + 1} of ${flashcards.length}`}
      />

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / flashcards.length) * 100}%`,
          }}
        ></div>
      </div>

      {/* Flashcard */}
      <div className="max-w-2xl mx-auto">
        <Card className="min-h-96">
          <div className="relative h-96">
            {/* Card Content */}
            <div
              className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
                isFlipped ? "rotate-y-180" : ""
              }`}
              style={{ 
                transformStyle: "preserve-3d",
                perspective: "1000px"
              }}
            >
              {/* Front Side */}
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
                      <img
                        src={currentCard.imageUrl}
                        alt="Flashcard"
                        className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
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

                  <div className="mt-6">
                    <Button onClick={handleFlip} variant="primary" size="lg">
                      Show Answer
                    </Button>
                  </div>
                </div>
              </div>

              {/* Back Side */}
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
                        "{currentCard.example}"
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

                  <div className="mt-6">
                    <Button onClick={handleFlip} variant="outline" size="lg">
                      Show Question
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation Controls */}
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
                setShowAnswer(false);
              }}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-blue-600"
                  : index < currentIndex
                  ? "bg-green-500"
                  : "bg-gray-300"
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

      {/* Statistics */}
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
