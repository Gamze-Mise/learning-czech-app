"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type CourseDetail = {
  id: number;
  title: string;
  order: number;
  level: number;
  description: string | null;
  thumbnail: string | null;
  isActive: boolean;
};

export default function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/courses/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((d) => setCourse(d.course))
      .catch(() => setError("Course not found"))
      .finally(() => setLoading(false));
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!course) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
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
        setError(data.error ?? "Update failed");
        return;
      }
      setCourse(data.course);
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function deactivate() {
    if (!confirm("Deactivate this course?")) return;
    await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
    router.push("/admin/courses");
  }

  if (loading) return <p className="text-slate-600">Loading…</p>;
  if (error || !course) {
    return (
      <div>
        <p className="text-red-600">{error ?? "Not found"}</p>
        <Link href="/admin/courses" className="text-indigo-600 hover:underline">
          ← Back
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <Link href="/admin/courses" className="text-sm text-indigo-600 hover:underline">
          ← Back to courses
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Edit course</h1>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
      >
        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Title
          </label>
          <input
            value={course.title}
            onChange={(e) => setCourse({ ...course, title: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Order
            </label>
            <input
              type="number"
              min={1}
              value={course.order}
              onChange={(e) => setCourse({ ...course, order: Number(e.target.value) })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Level
            </label>
            <input
              type="number"
              min={1}
              value={course.level}
              onChange={(e) => setCourse({ ...course, level: Number(e.target.value) })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            value={course.description ?? ""}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value || null })
            }
            rows={4}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Thumbnail URL
          </label>
          <input
            value={course.thumbnail ?? ""}
            onChange={(e) =>
              setCourse({ ...course, thumbnail: e.target.value || null })
            }
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            placeholder="https://…"
          />
        </div>
        <label className="flex items-center gap-2 text-slate-700">
          <input
            type="checkbox"
            checked={course.isActive}
            onChange={(e) => setCourse({ ...course, isActive: e.target.checked })}
          />
          Active
        </label>
        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>

      <div className="border border-red-200 bg-red-50 rounded-xl p-4">
        <p className="text-sm text-red-800 font-medium">Danger zone</p>
        <button type="button" onClick={deactivate} className="mt-2 text-sm text-red-700 underline">
          Deactivate course
        </button>
      </div>
    </div>
  );
}

