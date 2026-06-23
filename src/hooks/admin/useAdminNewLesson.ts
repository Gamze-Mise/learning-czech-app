"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { messageFromResponseBody } from "@/lib/http/parse-response";
import {
  type NewLessonFieldErrors,
  validateNewLessonFields,
} from "@/lib/lessons/new-lesson-validation";

export type UnitOption = {
  id: number;
  title: string;
  isActive: boolean;
  course: { title: string | null } | null;
};

export function useAdminNewLesson() {
  const router = useRouter();
  const [units, setUnits] = useState<UnitOption[]>([]);
  const [unitsLoading, setUnitsLoading] = useState(true);
  const [unitsError, setUnitsError] = useState<string | null>(null);
  const [unitId, setUnitId] = useState("");
  const [unitQuery, setUnitQuery] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<string>("VOCABULARY");
  const [difficulty, setDifficulty] = useState("1");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<NewLessonFieldErrors>({});
  const [successOpen, setSuccessOpen] = useState(false);
  const [createdLessonId, setCreatedLessonId] = useState<number | null>(null);

  const unitsForSelect = useMemo(() => {
    const q = unitQuery.trim().toLowerCase();
    const filtered = !q
      ? units
      : units.filter((u) => {
          const courseTitle = u.course?.title ?? "";
          return (
            u.title.toLowerCase().includes(q) ||
            courseTitle.toLowerCase().includes(q)
          );
        });
    const selected =
      unitId !== "" ? units.find((u) => String(u.id) === unitId) : undefined;
    if (selected && !filtered.some((u) => u.id === selected.id)) {
      return [selected, ...filtered];
    }
    return filtered;
  }, [units, unitQuery, unitId]);

  const loadUnits = useCallback(async () => {
    setUnitsLoading(true);
    setUnitsError(null);
    try {
      const res = await fetch("/api/admin/units");
      const text = await res.text();
      let obj: { units?: unknown; error?: string };
      try {
        obj = text ? (JSON.parse(text) as { units?: unknown; error?: string }) : {};
      } catch {
        setUnits([]);
        setUnitsError(
          res.ok
            ? "Units response was not valid JSON."
            : messageFromResponseBody(text, res.status)
        );
        return;
      }
      if (!res.ok) {
        setUnits([]);
        setUnitsError(
          typeof obj.error === "string" && obj.error.trim()
            ? obj.error
            : messageFromResponseBody(text, res.status)
        );
        return;
      }
      setUnits(Array.isArray(obj.units) ? (obj.units as UnitOption[]) : []);
    } catch {
      setUnits([]);
      setUnitsError("Network error while loading units. Check your connection.");
    } finally {
      setUnitsLoading(false);
    }
  }, []);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const initialUnitId = sp.get("unitId");
    if (initialUnitId && /^\d+$/.test(initialUnitId)) {
      setUnitId(initialUnitId);
    }
    void loadUnits();
  }, [loadUnits]);

  useEffect(() => {
    if (!successOpen) return;
    const t = window.setTimeout(() => {
      if (createdLessonId != null) {
        router.replace(`/admin/lessons/${createdLessonId}`);
      } else {
        router.replace("/admin/lessons");
      }
    }, 900);
    return () => window.clearTimeout(t);
  }, [successOpen, createdLessonId, router]);

  const canSubmit =
    !submitting &&
    !unitsLoading &&
    !unitsError &&
    units.length > 0 &&
    unitId !== "" &&
    units.some((u) => String(u.id) === unitId) &&
    title.trim().length > 0;

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError(null);
      const nextField = validateNewLessonFields({
        unitId,
        title,
        difficulty,
        estimatedTime,
        thumbnail,
      });
      setFieldErrors(nextField);
      if (Object.keys(nextField).length > 0) {
        setFormError("Fix the highlighted fields and try again.");
        return;
      }

      setSubmitting(true);
      try {
        const res = await fetch("/api/admin/lessons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            unitId: Number(unitId),
            title: title.trim(),
            description: description.trim() || null,
            type,
            difficulty: Number(difficulty),
            estimatedTime: estimatedTime.trim() ? Number(estimatedTime) : null,
            isActive,
            thumbnail: thumbnail.trim() || null,
          }),
        });

        const text = await res.text();
        let payload: unknown;
        try {
          payload = text ? JSON.parse(text) : null;
        } catch {
          setFormError(messageFromResponseBody(text, res.status));
          return;
        }

        if (!res.ok) {
          const msg =
            typeof (payload as { error?: string }).error === "string" &&
            (payload as { error: string }).error.trim()
              ? (payload as { error: string }).error.trim()
              : messageFromResponseBody(text, res.status);
          if (res.status === 400) {
            if (/unit/i.test(msg) && /select|valid/i.test(msg)) {
              setFieldErrors((prev) => ({ ...prev, unitId: msg }));
            } else if (/title/i.test(msg)) {
              setFieldErrors((prev) => ({ ...prev, title: msg }));
            } else if (/difficulty/i.test(msg)) {
              setFieldErrors((prev) => ({ ...prev, difficulty: msg }));
            } else if (/time|estimated/i.test(msg)) {
              setFieldErrors((prev) => ({ ...prev, estimatedTime: msg }));
            } else if (/thumbnail|url/i.test(msg)) {
              setFieldErrors((prev) => ({ ...prev, thumbnail: msg }));
            }
          }
          setFormError(msg);
          return;
        }

        const lesson = (payload as { lesson?: { id?: number } }).lesson;
        if (lesson?.id != null) {
          setCreatedLessonId(lesson.id);
        }
        setSuccessOpen(true);
      } catch {
        setFormError(
          "Network error — could not reach the server. Check your connection and try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
    [
      unitId,
      title,
      difficulty,
      estimatedTime,
      thumbnail,
      description,
      type,
      isActive,
    ]
  );

  return {
    units,
    unitsLoading,
    unitsError,
    unitId,
    setUnitId,
    unitQuery,
    setUnitQuery,
    unitsForSelect,
    title,
    setTitle,
    description,
    setDescription,
    type,
    setType,
    difficulty,
    setDifficulty,
    estimatedTime,
    setEstimatedTime,
    thumbnail,
    setThumbnail,
    isActive,
    setIsActive,
    submitting,
    formError,
    setFormError,
    fieldErrors,
    setFieldErrors,
    successOpen,
    createdLessonId,
    loadUnits,
    canSubmit,
    onSubmit,
    goToLessons: () => router.push("/admin/lessons"),
  };
}
