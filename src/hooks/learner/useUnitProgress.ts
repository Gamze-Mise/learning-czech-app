"use client";

import { useCallback, useEffect, useState } from "react";
import { devError } from "@/lib/logger";
import type { UnitWithProgress } from "@/lib/learner/types";
import { useRequireLearner } from "./useRequireLearner";

export function useUnitProgress(unitId: string) {
  const redirectPath = `/units/${unitId}`;
  const { userId, checking } = useRequireLearner(redirectPath);
  const [unit, setUnit] = useState<UnitWithProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUnitProgress = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `/api/units/${unitId}/progress?userId=${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        setUnit(data.unit);
      }
    } catch (error) {
      devError("Error fetching unit progress:", error);
    } finally {
      setLoading(false);
    }
  }, [unitId, userId]);

  useEffect(() => {
    if (checking) return;
    if (!userId) {
      setLoading(false);
      return;
    }
    void fetchUnitProgress();
  }, [checking, userId, fetchUnitProgress]);

  return { unit, loading: checking || loading };
}
