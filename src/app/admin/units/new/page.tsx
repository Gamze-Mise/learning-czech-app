"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type CourseOption = { id: number; title: string };

export default function NewUnitPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [courseId, setCourseId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("1");
  const [level, setLevel] = useState("1");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/courses")
      .then((r) => r.json())
      .then((d) => setCourses(d.courses ?? []))
      .catch(() => setCourses([]));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: courseId ? Number(courseId) : null,
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
      router.push(`/admin/units/${data.unit.id}`);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <Link href="/admin/units" className="text-sm text-indigo-600 hover:underline">
          ← Back to units
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">New unit</h1>
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
            Course
          </label>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
          >
            <option value="">(No course)</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Title *
          </label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
              value={order}
              onChange={(e) => setOrder(e.target.value)}
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
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Thumbnail URL
          </label>
          <input
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            placeholder="https://…"
          />
        </div>

        <label className="flex items-center gap-2 text-slate-700">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create unit"}
        </button>
      </form>
    </div>
  );
}

