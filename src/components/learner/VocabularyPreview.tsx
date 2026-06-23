import Button from "@/components/Button";
import Card from "@/components/Card";
import type { LearnerFlashcard } from "@/lib/learner/types";

type Props = {
  flashcards: LearnerFlashcard[];
  unitId: string;
  lessonId: string;
};

export default function VocabularyPreview({
  flashcards,
  unitId,
  lessonId,
}: Props) {
  if (flashcards.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Vocabulary Cards</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {flashcards.slice(0, 6).map((flashcard) => (
          <Card key={flashcard.id}>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 mb-2">
                {flashcard.frontText}
              </div>
              <div className="text-sm text-gray-800 mb-3 font-medium">
                {flashcard.backText}
              </div>
              {flashcard.example ? (
                <div className="text-xs text-gray-700 italic">
                  {flashcard.example}
                </div>
              ) : null}
              <div className="flex items-center justify-center mt-3 space-x-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {flashcard.category}
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  Level {flashcard.difficulty}
                </span>
              </div>
              {flashcard.audioUrl ? (
                <div className="mt-4 w-full max-w-xs mx-auto">
                  <audio
                    controls
                    src={flashcard.audioUrl}
                    className="w-full"
                    preload="metadata"
                  />
                </div>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
      {flashcards.length > 6 ? (
        <div className="text-center">
          <Button
            variant="outline"
            href={`/units/${unitId}/lessons/${lessonId}/flashcards`}
          >
            View All {flashcards.length} Cards
          </Button>
        </div>
      ) : null}
    </div>
  );
}
