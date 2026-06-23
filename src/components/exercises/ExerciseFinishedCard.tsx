import Button from "@/components/Button";
import Card from "@/components/Card";

type Props = {
  finishing: boolean;
  nextLesson: { id: number } | null;
  onNextLesson: () => void;
  onBackToUnit: () => void;
};

export default function ExerciseFinishedCard({
  finishing,
  nextLesson,
  onNextLesson,
  onBackToUnit,
}: Props) {
  return (
    <Card>
      <div className="text-center space-y-3 py-4">
        <div className="text-4xl">🎉</div>
        <h2 className="text-xl font-bold text-slate-900">Done</h2>
        <p className="text-slate-600">
          {finishing ? "Saving progress…" : "Lesson progress saved."}
        </p>
        <div className="flex justify-center gap-3 pt-2">
          {nextLesson ? (
            <Button onClick={onNextLesson} variant="primary">
              Next lesson →
            </Button>
          ) : (
            <Button onClick={onBackToUnit} variant="primary">
              Back to unit
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
