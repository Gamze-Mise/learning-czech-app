import Button from "@/components/Button";
import Card from "@/components/Card";
import LearnerStatGrid from "@/components/learner/LearnerStatGrid";

type Props = {
  unitId: string;
  lessonId: string;
  totalCards: number;
  knownCount: number;
  againCount: number;
  exerciseCount: number;
  onRestart: () => void;
};

export default function FlashcardSessionComplete({
  unitId,
  lessonId,
  totalCards,
  knownCount,
  againCount,
  exerciseCount,
  onRestart,
}: Props) {
  const exercisesHref = `/units/${unitId}/lessons/${lessonId}/exercises`;
  const lessonHref = `/units/${unitId}/lessons/${lessonId}`;
  const practiceHref = `/units/${unitId}/lessons/${lessonId}/practice`;
  const hasExercises = exerciseCount > 0;

  return (
    <Card>
      <div className="text-center space-y-5 py-2">
        <div className="text-5xl" aria-hidden>
          🎉
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">All cards reviewed!</h2>
          <p className="mt-2 text-slate-600">
            {hasExercises
              ? "Nice work. Ready to test what you learned?"
              : "Nice work. You can review again or return to the lesson."}
          </p>
        </div>

        <LearnerStatGrid
          columns={3}
          items={[
            { value: totalCards, label: "Reviewed", theme: "blue" },
            { value: knownCount, label: "Got it", theme: "green" },
            { value: againCount, label: "Again", theme: "orange" },
          ]}
        />

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-1">
          {hasExercises ? (
            <Button href={exercisesHref} variant="primary" size="lg" className="flex-1 sm:flex-none">
              Continue to Exercises →
            </Button>
          ) : (
            <Button href={lessonHref} variant="primary" size="lg" className="flex-1 sm:flex-none">
              Back to Lesson
            </Button>
          )}
          <Button variant="outline" onClick={onRestart} className="flex-1 sm:flex-none">
            Review again
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
          {hasExercises ? (
            <Button href={lessonHref} variant="outline" size="sm">
              Back to Lesson
            </Button>
          ) : null}
          <Button href={practiceHref} variant="outline" size="sm">
            Back to Practice
          </Button>
        </div>
      </div>
    </Card>
  );
}
