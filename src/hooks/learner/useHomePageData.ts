"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { devError } from "@/lib/logger";

export function useHomePageData() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      if (!meRes.ok || !meData.user) {
        router.replace("/login?redirect=/");
        return;
      }
      const userId = meData.user.id;

      const progressResponse = await fetch(
        `/api/users/progress?userId=${userId}`,
      );
      const progressData = await progressResponse.json();
      setUserProgress(progressData);

      const coursesResponse = await fetch("/api/courses");
      const coursesData = await coursesResponse.json();
      setCourses(coursesData.courses || []);
    } catch (error) {
      devError("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { courses, userProgress, loading };
}
