"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LESSON_TYPES = [
  "VOCABULARY",
  "GRAMMAR",
  "CONVERSATION",
  "PRONUNCIATION",
  "CULTURE",
  "MIXED",
] as const;

type LessonDetail = {
  id: number;
  unitId: number;
  title: string;
  order: number;
  description: string | null;
  type: string;
  difficulty: number;
  estimatedTime: number | null;
  isActive: boolean;
  unit: { id: number; title: string };
};

export default function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/lessons/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((d) => setLesson(d.lesson))
      .catch(() => setError("Lesson not found"))
      .finally(() => setLoading(false));
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!lesson) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/lessons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: lesson.title.trim(),
          order: lesson.order,
          description: lesson.description?.trim() || null,
          type: lesson.type,
          difficulty: lesson.difficulty,
          estimatedTime: lesson.estimatedTime,
          isActive: lesson.isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Update failed");
        return;
      }
      setLesson(data.lesson);
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function deactivate() {
    if (!confirm("Deactivate this lesson? It will be hidden in the app."))
      return;
    await fetch(`/api/admin/lessons/${id}`, { method: "DELETE" });
    router.push("/admin/lessons");
  }

  if (loading) {
    return <p className="text-slate-600">Loading…</p>;
  }
  if (error || !lesson) {
    return (
      <div>
        <p className="text-red-600">{error ?? "Not found"}</p>
        <Link href="/admin/lessons" className="text-blue-600">
          ← Back
        </Link>
      </div>
    );
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
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Edit lesson</h1>
        <p className="text-sm text-slate-500 mt-1">
          Unit: {lesson.unit.title} (ID {lesson.unitId})
        </p>
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
            value={lesson.title}
            onChange={(e) =>
              setLesson({ ...lesson, title: e.target.value })
            }
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
              value={lesson.order}
              onChange={(e) =>
                setLesson({ ...lesson, order: Number(e.target.value) })
              }
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
              value={lesson.difficulty}
              onChange={(e) =>
                setLesson({ ...lesson, difficulty: Number(e.target.value) })
              }
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Type
          </label>
          <select
            value={lesson.type}
            onChange={(e) =>
              setLesson({ ...lesson, type: e.target.value })
            }
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
            value={lesson.description ?? ""}
            onChange={(e) =>
              setLesson({ ...lesson, description: e.target.value || null })
            }
            rows={4}
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
            value={lesson.estimatedTime ?? ""}
            onChange={(e) =>
              setLesson({
                ...lesson,
                estimatedTime: e.target.value
                  ? Number(e.target.value)
                  : null,
              })
            }
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
          />
        </div>
        <label className="flex items-center gap-2 text-slate-700">
          <input
            type="checkbox"
            checked={lesson.isActive}
            onChange={(e) =>
              setLesson({ ...lesson, isActive: e.target.checked })
            }
          />
          Active (visible in app)
        </label>
        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>

      <div className="border border-red-200 bg-red-50 rounded-xl p-4">
        <p className="text-sm text-red-800 font-medium">Danger zone</p>
        <button
          type="button"
          onClick={deactivate}
          className="mt-2 text-sm text-red-700 underline"
        >
          Deactivate lesson
        </button>
      </div>
    </div>
  );
}
