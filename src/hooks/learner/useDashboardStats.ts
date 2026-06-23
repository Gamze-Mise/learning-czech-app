"use client";

import { useCallback, useEffect, useState } from "react";
import { devError } from "@/lib/logger";

export interface DashboardStats {
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

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard/stats?userId=1");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      devError("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDashboardStats();
  }, [fetchDashboardStats]);

  return { stats, loading, refetch: fetchDashboardStats };
}
