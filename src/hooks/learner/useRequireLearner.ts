"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useRequireLearner(redirectPath: string) {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [checking, setChecking] = useState(true);

  const check = useCallback(async () => {
    setChecking(true);
    try {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      if (!meRes.ok || !meData.user) {
        router.replace(`/login?redirect=${encodeURIComponent(redirectPath)}`);
        return null;
      }
      setUserId(meData.user.id);
      return meData.user.id as number;
    } finally {
      setChecking(false);
    }
  }, [redirectPath, router]);

  useEffect(() => {
    void check();
  }, [check]);

  return { userId, checking, refreshAuth: check };
}
