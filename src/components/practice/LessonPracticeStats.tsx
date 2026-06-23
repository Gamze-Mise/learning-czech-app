import Card from "@/components/Card";

type LessonPracticeStatsProps = {
  estimatedTime: number | null;
  flashcardCount: number;
  exerciseCount: number;
  difficulty: string | number;
};

export default function LessonPracticeStats({
  estimatedTime,
  flashcardCount,
  exerciseCount,
  difficulty,
}: LessonPracticeStatsProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Lesson Information
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-xl font-bold text-blue-600">{estimatedTime}</div>
          <div className="text-xs text-blue-500">Minutes</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-xl font-bold text-green-600">{flashcardCount}</div>
          <div className="text-xs text-green-500">Flashcards</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="text-xl font-bold text-purple-600">{exerciseCount}</div>
          <div className="text-xs text-purple-500">Exercises</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-3">
          <div className="text-xl font-bold text-orange-600">{difficulty}</div>
          <div className="text-xs text-orange-500">Difficulty</div>
        </div>
      </div>
    </Card>
  );
}
