"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

export function useAdminNewCourse() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("1");
  const [level, setLevel] = useState("1");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            order: Number(order) || 1,
            level: Number(level) || 1,
            description: description.trim() || null,
            thumbnail: thumbnail.trim() || null,
            isActive,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Create failed");
          return;
        }
        router.push(`/admin/courses/${data.course.id}`);
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    },
    [title, order, level, description, thumbnail, isActive, router]
  );

  return {
    title,
    setTitle,
    order,
    setOrder,
    level,
    setLevel,
    description,
    setDescription,
    thumbnail,
    setThumbnail,
    isActive,
    setIsActive,
    loading,
    error,
    onSubmit,
  };
}
