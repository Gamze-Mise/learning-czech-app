"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LESSON_TYPES = [
  "VOCABULARY",
  "GRAMMAR",
  "CONVERSATION",
  "PRONUNCIATION",
  "CULTURE",
  "MIXED",
] as const;

type UnitOption = {
  id: number;
  title: string;
  course: { title: string | null } | null;
};

export default function NewLessonPage() {
  const router = useRouter();
  const [units, setUnits] = useState<UnitOption[]>([]);
  const [unitId, setUnitId] = useState("");
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("1");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<string>("VOCABULARY");
  const [difficulty, setDifficulty] = useState("1");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/units")
      .then((r) => r.json())
      .then((d) => setUnits(d.units ?? []))
      .catch(() => setError("Could not load units"));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitId: Number(unitId),
          title: title.trim(),
          order: Number(order) || 1,
          description: description.trim() || null,
          type,
          difficulty: Number(difficulty) || 1,
          estimatedTime: estimatedTime ? Number(estimatedTime) : null,
          isActive: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create");
        return;
      }
      router.push(`/admin/lessons/${data.lesson.id}`);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <Link
          href="/admin/lessons"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to lessons
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">New lesson</h1>
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
            Unit *
          </label>
          <select
            required
            value={unitId}
            onChange={(e) => setUnitId(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
          >
            <option value="">Select unit…</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.title} {u.course?.title ? `— ${u.course.title}` : ""}
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
              Difficulty
            </label>
            <input
              type="number"
              min={1}
              max={5}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
          >
            {LESSON_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Estimated time (minutes)
          </label>
          <input
            type="number"
            min={0}
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            placeholder="Optional"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving…" : "Create lesson"}
        </button>
      </form>
    </div>
  );
}
