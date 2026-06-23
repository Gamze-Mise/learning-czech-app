import Card from "@/components/Card";
import type { DashboardStats } from "@/hooks/learner/useDashboardStats";

type Props = {
  stats: DashboardStats;
};

export default function DashboardStatTiles({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">
            {stats.lessonsCompleted}
          </div>
          <div className="text-sm text-gray-600">Lessons Completed</div>
        </div>
      </Card>
      <Card>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">
            {stats.flashcardsMastered}
          </div>
          <div className="text-sm text-gray-600">Flashcards Mastered</div>
        </div>
      </Card>
      <Card>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">
            {stats.averageScore}%
          </div>
          <div className="text-sm text-gray-600">Average Score</div>
        </div>
      </Card>
      <Card>
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600">
            {stats.currentStreak}
          </div>
          <div className="text-sm text-gray-600">Study Streak (days)</div>
        </div>
      </Card>
    </div>
  );
}
