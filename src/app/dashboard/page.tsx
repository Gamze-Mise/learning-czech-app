"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import Button from "@/components/Button";

interface DashboardStats {
  overallProgress: number;
  vocabularyMastery: number;
  grammarUnderstanding: number;
  lessonsCompleted: number;
  flashcardsMastered: number;
  averageScore: number;
  currentStreak: number;
  totalLessons: number;
  totalFlashcards: number;
  xp: number;
  level: number;
  longestStreak: number;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    timestamp: string;
    xpEarned: number;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats?userId=1");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

    return time.toLocaleDateString();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "lesson":
        return "📚";
      case "flashcard":
        return "🎴";
      case "exercise":
        return "🧪";
      default:
        return "📖";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "lesson":
        return "bg-green-500";
      case "flashcard":
        return "bg-blue-500";
      case "exercise":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          subtitle="Track your learning progress and achievements"
        />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          subtitle="Track your learning progress and achievements"
        />
        <Card>
          <p className="text-center text-gray-600">
            Unable to load dashboard data. Please try again later.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Track your learning progress and achievements"
      />

      {/* User Level & XP */}
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

      {/* Learning Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Learning Progress
          </h2>
          <div className="space-y-4">
            <ProgressBar
              label="Overall Progress"
              percentage={stats.overallProgress}
              color="blue"
            />
            <ProgressBar
              label="Vocabulary Mastery"
              percentage={stats.vocabularyMastery}
              color="green"
            />
            <ProgressBar
              label="Grammar Understanding"
              percentage={stats.grammarUnderstanding}
              color="purple"
            />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>
              {stats.lessonsCompleted} of {stats.totalLessons} lessons completed
            </p>
            <p>
              {stats.flashcardsMastered} of {stats.totalFlashcards} flashcards
              mastered
            </p>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-3">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div
                    className={`w-2 h-2 ${getActivityColor(
                      activity.type
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
                <p className="text-sm">
                  Start learning to see your progress here!
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Statistics */}
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

      {/* Quick Actions */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            href="/"
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left"
          >
            <h3 className="font-semibold text-blue-800">Continue Learning</h3>
            <p className="text-sm text-blue-600">Resume your current lesson</p>
          </Button>
          <Button
            href="/units"
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
          >
            <h3 className="font-semibold text-green-800">Browse Units</h3>
            <p className="text-sm text-green-600">
              Explore all available lessons
            </p>
          </Button>
          <Button
            onClick={fetchDashboardStats}
            className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left"
          >
            <h3 className="font-semibold text-purple-800">Refresh Stats</h3>
            <p className="text-sm text-purple-600">Update your progress</p>
          </Button>
        </div>
      </Card>
    </div>
  );
}
