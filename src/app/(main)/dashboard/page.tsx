"use client";

import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import PageLoadingSpinner from "@/components/learner/PageLoadingSpinner";
import DashboardLevelCard from "@/components/dashboard/DashboardLevelCard";
import DashboardProgressSection from "@/components/dashboard/DashboardProgressSection";
import DashboardActivityFeed from "@/components/dashboard/DashboardActivityFeed";
import DashboardStatTiles from "@/components/dashboard/DashboardStatTiles";
import DashboardQuickActions from "@/components/dashboard/DashboardQuickActions";
import { useDashboardStats } from "@/hooks/learner/useDashboardStats";

export default function DashboardPage() {
  const { stats, loading, refetch } = useDashboardStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          subtitle="Track your learning progress and achievements"
        />
        <PageLoadingSpinner message="Loading your dashboard..." />
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

      <DashboardLevelCard stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardProgressSection stats={stats} />
        <DashboardActivityFeed activities={stats.recentActivity} />
      </div>

      <DashboardStatTiles stats={stats} />

      <DashboardQuickActions onRefresh={refetch} />
    </div>
  );
}
