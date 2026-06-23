"use client";

import { useCallback, useEffect, useState } from "react";
import { devError } from "@/lib/logger";
import type { LessonDetail } from "@/lib/learner/types";

export function useLessonDetail(lessonId: string) {
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLesson = useCallback(async () => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}`);
      if (response.ok) {
        const data = await response.json();
        setLesson(data);
      }
    } catch (error) {
      devError("Error fetching lesson:", error);
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    void fetchLesson();
  }, [fetchLesson]);

  return { lesson, loading };
}
