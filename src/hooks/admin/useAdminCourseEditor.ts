"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CourseDetail } from "@/lib/courses/types";

export function useAdminCourseEditor(courseId: string) {
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/courses/${courseId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((d) => {
        setCourse(d.course as CourseDetail);
        setLoadError(null);
      })
      .catch(() => {
        setCourse(null);
        setLoadError("Course not found");
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!course) return;
      setSaving(true);
      setSaveError(null);
      try {
        const res = await fetch(`/api/admin/courses/${courseId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: course.title,
            order: course.order,
            level: course.level,
            description: course.description,
            thumbnail: course.thumbnail,
            isActive: course.isActive,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setSaveError(data.error ?? "Update failed");
          return;
        }
        setCourse((prev) => {
          const next = data.course as CourseDetail;
          if (!prev) return next;
          return { ...next, units: prev.units };
        });
      } catch {
        setSaveError("Network error");
      } finally {
        setSaving(false);
      }
    },
    [course, courseId]
  );

  const deactivateCourse = useCallback(async () => {
    if (!confirm("Deactivate this course?")) return;
    await fetch(`/api/admin/courses/${courseId}`, { method: "DELETE" });
    router.push("/admin/courses");
  }, [courseId, router]);

  return {
    course,
    setCourse,
    loading,
    loadError,
    saving,
    saveError,
    onSubmit,
    deactivateCourse,
  };
}
