import Card from "@/components/Card";
import {
  formatTimeAgo,
  getActivityColor,
  getActivityIcon,
} from "@/lib/learner/display";
import type { DashboardStats } from "@/hooks/learner/useDashboardStats";

type Props = {
  activities: DashboardStats["recentActivity"];
};

export default function DashboardActivityFeed({ activities }: Props) {
  return (
    <Card>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
      <div className="space-y-3">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div
                className={`w-2 h-2 ${getActivityColor(
                  activity.type,
                )} rounded-full`}
              ></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {getActivityIcon(activity.type)} {activity.title}
                </p>
                <p className="text-xs text-gray-500">
                  {formatTimeAgo(activity.timestamp)}
                  {activity.xpEarned > 0 && ` • +${activity.xpEarned} XP`}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity</p>
            <p className="text-sm">Start learning to see your progress here!</p>
          </div>
        )}
      </div>
    </Card>
  );
}
