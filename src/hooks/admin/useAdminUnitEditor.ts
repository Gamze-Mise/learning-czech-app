"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UnitDetail } from "@/lib/units/types";

export function useAdminUnitEditor(unitId: string) {
  const router = useRouter();
  const [unit, setUnit] = useState<UnitDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccessOpen, setSaveSuccessOpen] = useState(false);

  useEffect(() => {
    if (!saveSuccessOpen) return;
    const t = window.setTimeout(() => {
      router.push("/admin/units");
    }, 2500);
    return () => window.clearTimeout(t);
  }, [saveSuccessOpen, router]);

  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    fetch(`/api/admin/units/${unitId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((d) => {
        setUnit(d.unit as UnitDetail);
        setLoadError(null);
      })
      .catch(() => {
        setUnit(null);
        setLoadError("Unit not found");
      })
      .finally(() => setLoading(false));
  }, [unitId]);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!unit) return;
      setSaving(true);
      setSaveError(null);
      try {
        const res = await fetch(`/api/admin/units/${unitId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: unit.title,
            level: unit.level,
            description: unit.description,
            thumbnail: unit.thumbnail,
            isActive: unit.isActive,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setSaveError(data.error ?? "Update failed");
          return;
        }
        setUnit((prev) => {
          const u = data.unit as UnitDetail;
          if (!prev) return u;
          return { ...u, lessons: prev.lessons, course: prev.course };
        });
        setSaveSuccessOpen(true);
      } catch {
        setSaveError("Network error");
      } finally {
        setSaving(false);
      }
    },
    [unit, unitId]
  );

  return {
    unit,
    setUnit,
    loading,
    loadError,
    saving,
    saveError,
    saveSuccessOpen,
    onSubmit,
    goToUnits: () => router.push("/admin/units"),
  };
}
