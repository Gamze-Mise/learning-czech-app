"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAdminNewUnit() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("1");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    if (!successOpen) return;
    const t = window.setTimeout(() => {
      router.push("/admin/units");
    }, 2500);
    return () => window.clearTimeout(t);
  }, [successOpen, router]);

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
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
      setSuccessOpen(true);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [title, level, description, thumbnail, isActive]);

  return {
    title,
    setTitle,
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
    successOpen,
    onSubmit,
    goToUnits: () => router.push("/admin/units"),
  };
}
