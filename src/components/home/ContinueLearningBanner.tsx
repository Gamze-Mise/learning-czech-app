import Button from "@/components/Button";

type Props = {
  lessonsCompleted: number;
  xp: number;
  lastIncompleteLesson?: { title: string } | null;
  continueLearningLink: string;
};

export default function ContinueLearningBanner({
  lessonsCompleted,
  xp,
  lastIncompleteLesson,
  continueLearningLink,
}: Props) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Continue Learning</h2>
          <p className="text-blue-100 mb-2">
            You have completed {lessonsCompleted} lessons. Keep going!
          </p>
          {lastIncompleteLesson && (
            <p className="text-sm text-blue-200">
              Next: {lastIncompleteLesson.title}
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="text-sm text-blue-200 mb-2">
            {xp} XP • {lessonsCompleted} lessons
          </div>
          <Button
            href={continueLearningLink}
            variant="secondary"
            size="lg"
            className="!bg-white !text-blue-700 hover:!bg-blue-50 !font-bold !border-2 !border-white shadow-lg"
          >
            Continue Learning →
          </Button>
        </div>
      </div>
    </div>
  );
}
