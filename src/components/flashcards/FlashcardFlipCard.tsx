"use client";

import Button from "@/components/Button";
import Card from "@/components/Card";
import type { LearnerFlashcard } from "@/lib/learner/types";

type Props = {
  card: LearnerFlashcard;
  isFlipped: boolean;
  savingProgress: boolean;
  onFlip: () => void;
  onKnown: () => void;
  onUnknown: () => void;
};

export default function FlashcardFlipCard({
  card,
  isFlipped,
  savingProgress,
  onFlip,
  onKnown,
  onUnknown,
}: Props) {
  return (
    <Card className="min-h-96">
      <div className="relative h-96 cursor-pointer" onClick={onFlip} aria-label="Flip card">
        <div
          className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
        >
          <div
            className="absolute inset-0"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(0deg)" }}
          >
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              {card.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- remote lesson URLs
                <img
                  src={card.imageUrl}
                  alt="Flashcard"
                  className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-cover.svg";
                  }}
                />
              ) : null}
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{card.frontText}</h2>
              {card.audioUrl ? (
                <div
                  className="mt-2 w-full max-w-xs"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  role="presentation"
                >
                  <audio controls src={card.audioUrl} className="w-full" preload="metadata" />
                </div>
              ) : null}
              <p className="mt-6 text-sm text-gray-500">Tap the card to flip and see the answer.</p>
            </div>
          </div>

          <div
            className="absolute inset-0"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-blue-50">
              <h2 className="text-3xl font-bold text-blue-800 mb-4">{card.backText}</h2>
              {card.example ? (
                <div className="bg-white rounded-lg p-4 mb-6 max-w-md">
                  <p className="text-gray-600 italic">{`“${card.example}”`}</p>
                </div>
              ) : null}
              <div className="flex space-x-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {card.category}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  Level {card.difficulty}
                </span>
              </div>
              <p className="mt-4 text-sm text-blue-700">Decide how well you knew this card.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button
                  onClick={onUnknown}
                  variant="secondary"
                  size="md"
                  disabled={savingProgress}
                  className="bg-red-50 text-red-700 hover:bg-red-100"
                >
                  Again
                </Button>
                <Button
                  onClick={onKnown}
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
  );
}
