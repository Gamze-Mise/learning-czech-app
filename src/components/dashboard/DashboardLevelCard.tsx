import Card from "@/components/Card";
import type { DashboardStats } from "@/hooks/learner/useDashboardStats";

type Props = {
  stats: DashboardStats;
};

export default function DashboardLevelCard({ stats }: Props) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Level {stats.level}
          </h2>
          <p className="text-gray-600">{stats.xp} XP earned</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Longest Streak</p>
          <p className="text-2xl font-bold text-orange-600">
            {stats.longestStreak} days
          </p>
        </div>
      </div>
    </Card>
  );
}
