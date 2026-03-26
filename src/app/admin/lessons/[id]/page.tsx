"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LESSON_TYPES = [
  "VOCABULARY",
  "GRAMMAR",
  "CONVERSATION",
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
  parts?: any[];
  flashcards?: any[];
  exercises?: any[];
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
  const [busy, setBusy] = useState<string | null>(null);

  // New content forms (URL-based assets for now)
  const [newPart, setNewPart] = useState({
    order: "1",
    type: "TEXT",
    title: "",
    duration: "",
    audioUrl: "",
    videoUrl: "",
    content: "",
  });
  const [newCard, setNewCard] = useState({
    order: "1",
    frontText: "",
    backText: "",
    imageUrl: "",
    audioUrl: "",
    example: "",
    difficulty: "1",
    category: "",
  });
  const [newEx, setNewEx] = useState({
    order: "1",
    type: "MCQ",
    question: "",
    options: "",
    answer: "",
    explanation: "",
    points: "1",
    difficulty: "1",
    timeLimit: "",
    audioUrl: "",
    imageUrl: "",
  });
  const [editingPartId, setEditingPartId] = useState<number | null>(null);
  const [editingCardId, setEditingCardId] = useState<number | null>(null);
  const [editingExId, setEditingExId] = useState<number | null>(null);
  const [partDraft, setPartDraft] = useState<any | null>(null);
  const [cardDraft, setCardDraft] = useState<any | null>(null);
  const [exDraft, setExDraft] = useState<any | null>(null);

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

  async function refreshLesson() {
    const res = await fetch(`/api/admin/lessons/${id}`);
    const data = await res.json();
    if (res.ok) setLesson(data.lesson);
  }

  async function addPart(e: React.FormEvent) {
    e.preventDefault();
    if (!lesson) return;
    setBusy("part");
    setError(null);
    try {
      const res = await fetch(`/api/admin/lessons/${lesson.id}/parts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: Number(newPart.order) || 1,
          type: newPart.type,
          title: newPart.title || null,
          duration: newPart.duration ? Number(newPart.duration) : null,
          audioUrl: newPart.audioUrl || null,
          videoUrl: newPart.videoUrl || null,
          content: newPart.content || null,
          isActive: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to add part");
        return;
      }
      setNewPart({
        order: String((Number(newPart.order) || 1) + 1),
        type: "TEXT",
        title: "",
        duration: "",
        audioUrl: "",
        videoUrl: "",
        content: "",
      });
      await refreshLesson();
    } catch {
      setError("Network error");
    } finally {
      setBusy(null);
    }
  }

  async function deactivatePart(partId: number) {
    if (!lesson) return;
    if (!confirm("Deactivate this part?")) return;
    setBusy("part");
    await fetch(`/api/admin/lessons/${lesson.id}/parts/${partId}`, {
      method: "DELETE",
    });
    await refreshLesson();
    setBusy(null);
  }

  function startEditPart(part: any) {
    setEditingPartId(part.id);
    setPartDraft({
      order: String(part.order ?? 1),
      type: part.type ?? "TEXT",
      title: part.title ?? "",
      duration: part.duration != null ? String(part.duration) : "",
      audioUrl: part.audioUrl ?? "",
      videoUrl: part.videoUrl ?? "",
      content: part.content?.markdown ?? "",
      isActive: Boolean(part.isActive),
    });
  }

  async function savePart(partId: number) {
    if (!lesson || !partDraft) return;
    setBusy("part");
    setError(null);
    try {
      const res = await fetch(`/api/admin/lessons/${lesson.id}/parts/${partId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: Number(partDraft.order) || 1,
          type: partDraft.type,
          title: partDraft.title || null,
          duration: partDraft.duration ? Number(partDraft.duration) : null,
          audioUrl: partDraft.audioUrl || null,
          videoUrl: partDraft.videoUrl || null,
          content: partDraft.content || null,
          isActive: partDraft.isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to update part");
        return;
      }
      setEditingPartId(null);
      setPartDraft(null);
      await refreshLesson();
    } catch {
      setError("Network error");
    } finally {
      setBusy(null);
    }
  }

  async function addFlashcard(e: React.FormEvent) {
    e.preventDefault();
    if (!lesson) return;
    setBusy("card");
    setError(null);
    try {
      const res = await fetch(`/api/admin/lessons/${lesson.id}/flashcards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: Number(newCard.order) || 1,
          frontText: newCard.frontText,
          backText: newCard.backText,
          imageUrl: newCard.imageUrl || null,
          audioUrl: newCard.audioUrl || null,
          example: newCard.example || null,
          difficulty: Number(newCard.difficulty) || 1,
          category: newCard.category || null,
          isActive: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to add flashcard");
        return;
      }
      setNewCard({
        order: String((Number(newCard.order) || 1) + 1),
        frontText: "",
        backText: "",
        imageUrl: "",
        audioUrl: "",
        example: "",
        difficulty: "1",
        category: "",
      });
      await refreshLesson();
    } catch {
      setError("Network error");
    } finally {
      setBusy(null);
    }
  }

  async function deactivateFlashcard(flashcardId: number) {
    if (!lesson) return;
    if (!confirm("Deactivate this flashcard?")) return;
    setBusy("card");
    await fetch(`/api/admin/lessons/${lesson.id}/flashcards/${flashcardId}`, {
      method: "DELETE",
    });
    await refreshLesson();
    setBusy(null);
  }

  function startEditCard(card: any) {
    setEditingCardId(card.id);
    setCardDraft({
      order: String(card.order ?? 1),
      frontText: card.frontText ?? "",
      backText: card.backText ?? "",
      imageUrl: card.imageUrl ?? "",
      audioUrl: card.audioUrl ?? "",
      example: card.example ?? "",
      difficulty: String(card.difficulty ?? 1),
      category: card.category ?? "",
      isActive: Boolean(card.isActive),
    });
  }

  async function saveCard(cardId: number) {
    if (!lesson || !cardDraft) return;
    setBusy("card");
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/lessons/${lesson.id}/flashcards/${cardId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order: Number(cardDraft.order) || 1,
            frontText: cardDraft.frontText,
            backText: cardDraft.backText,
            imageUrl: cardDraft.imageUrl || null,
            audioUrl: cardDraft.audioUrl || null,
            example: cardDraft.example || null,
            difficulty: Number(cardDraft.difficulty) || 1,
            category: cardDraft.category || null,
            isActive: cardDraft.isActive,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to update flashcard");
        return;
      }
      setEditingCardId(null);
      setCardDraft(null);
      await refreshLesson();
    } catch {
      setError("Network error");
    } finally {
      setBusy(null);
    }
  }

  async function addExercise(e: React.FormEvent) {
    e.preventDefault();
    if (!lesson) return;
    setBusy("ex");
    setError(null);
    try {
      const res = await fetch(`/api/admin/lessons/${lesson.id}/exercises`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: Number(newEx.order) || 1,
          type: newEx.type,
          question: newEx.question,
          options: newEx.options || null,
          answer: newEx.answer || null,
          explanation: newEx.explanation || null,
          points: Number(newEx.points) || 1,
          difficulty: Number(newEx.difficulty) || 1,
          timeLimit: newEx.timeLimit ? Number(newEx.timeLimit) : null,
          audioUrl: newEx.audioUrl || null,
          imageUrl: newEx.imageUrl || null,
          isActive: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to add exercise");
        return;
      }
      setNewEx({
        order: String((Number(newEx.order) || 1) + 1),
        type: "MCQ",
        question: "",
        options: "",
        answer: "",
        explanation: "",
        points: "1",
        difficulty: "1",
        timeLimit: "",
        audioUrl: "",
        imageUrl: "",
      });
      await refreshLesson();
    } catch {
      setError("Network error");
    } finally {
      setBusy(null);
    }
  }

  async function deactivateExercise(exerciseId: number) {
    if (!lesson) return;
    if (!confirm("Deactivate this exercise?")) return;
    setBusy("ex");
    await fetch(`/api/admin/lessons/${lesson.id}/exercises/${exerciseId}`, {
      method: "DELETE",
    });
    await refreshLesson();
    setBusy(null);
  }

  function startEditExercise(ex: any) {
    setEditingExId(ex.id);
    setExDraft({
      order: String(ex.order ?? 1),
      type: ex.type ?? "MCQ",
      question: ex.question ?? "",
      options: ex.options ? JSON.stringify(ex.options, null, 2) : "",
      answer: ex.answer ?? "",
      explanation: ex.explanation ?? "",
      points: String(ex.points ?? 1),
      difficulty: String(ex.difficulty ?? 1),
      timeLimit: ex.timeLimit != null ? String(ex.timeLimit) : "",
      audioUrl: ex.audioUrl ?? "",
      imageUrl: ex.imageUrl ?? "",
      isActive: Boolean(ex.isActive),
    });
  }

  async function saveExercise(exerciseId: number) {
    if (!lesson || !exDraft) return;
    setBusy("ex");
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/lessons/${lesson.id}/exercises/${exerciseId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order: Number(exDraft.order) || 1,
            type: exDraft.type,
            question: exDraft.question,
            options: exDraft.options || null,
            answer: exDraft.answer || null,
            explanation: exDraft.explanation || null,
            points: Number(exDraft.points) || 1,
            difficulty: Number(exDraft.difficulty) || 1,
            timeLimit: exDraft.timeLimit ? Number(exDraft.timeLimit) : null,
            audioUrl: exDraft.audioUrl || null,
            imageUrl: exDraft.imageUrl || null,
            isActive: exDraft.isActive,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to update exercise");
        return;
      }
      setEditingExId(null);
      setExDraft(null);
      await refreshLesson();
    } catch {
      setError("Network error");
    } finally {
      setBusy(null);
    }
  }

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
    <div className="max-w-4xl space-y-8">
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

      {/* Parts */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Lesson parts</h2>
            <p className="text-sm text-slate-600">Introduction, audio, video, etc.</p>
          </div>
          <span className="text-sm text-slate-500">
            {(lesson.parts ?? []).length} total
          </span>
        </div>

        <div className="space-y-2">
          {(lesson.parts ?? []).map((p: any) => (
            <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
              {editingPartId === p.id && partDraft ? (
                <div className="w-full space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <input value={partDraft.order} onChange={(e) => setPartDraft({ ...partDraft, order: e.target.value })} className="border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-900" />
                    <select value={partDraft.type} onChange={(e) => setPartDraft({ ...partDraft, type: e.target.value })} className="border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-900">
                      {["TEXT","AUDIO","VIDEO","FLASHCARD_LIST","EXERCISE","QUIZ","INTERACTIVE"].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input value={partDraft.duration} onChange={(e) => setPartDraft({ ...partDraft, duration: e.target.value })} placeholder="duration" className="border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-900" />
                  </div>
                  <input value={partDraft.title} onChange={(e) => setPartDraft({ ...partDraft, title: e.target.value })} placeholder="Title" className="w-full border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-900" />
                  <input value={partDraft.audioUrl} onChange={(e) => setPartDraft({ ...partDraft, audioUrl: e.target.value })} placeholder="Audio URL" className="w-full border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-900" />
                  <input value={partDraft.videoUrl} onChange={(e) => setPartDraft({ ...partDraft, videoUrl: e.target.value })} placeholder="Video URL" className="w-full border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-900" />
                  <textarea value={partDraft.content} onChange={(e) => setPartDraft({ ...partDraft, content: e.target.value })} rows={2} placeholder="Content markdown" className="w-full border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-900" />
                  <label className="text-xs text-slate-700 flex items-center gap-2">
                    <input type="checkbox" checked={partDraft.isActive} onChange={(e) => setPartDraft({ ...partDraft, isActive: e.target.checked })} />
                    Active
                  </label>
                  <div className="flex gap-3 justify-end">
                    <button type="button" onClick={() => { setEditingPartId(null); setPartDraft(null); }} className="text-xs font-semibold text-slate-600 hover:underline">Cancel</button>
                    <button type="button" disabled={busy === "part"} onClick={() => savePart(p.id)} className="text-xs font-semibold text-indigo-700 hover:underline">Save</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {p.order}. {p.title ?? "(untitled)"}
                    </div>
                    <div className="text-xs text-slate-600">
                      {p.type} {p.duration ? `• ${p.duration}s` : ""}{" "}
                      {!p.isActive ? "• Inactive" : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={busy === "part"}
                      onClick={() => startEditPart(p)}
                      className="text-xs font-semibold text-indigo-700 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={busy === "part"}
                      onClick={() => deactivatePart(p.id)}
                      className="text-xs font-semibold text-rose-700 hover:underline"
                    >
                      Deactivate
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {(lesson.parts ?? []).length === 0 && (
            <p className="text-sm text-slate-500">No parts yet.</p>
          )}
        </div>

        <form onSubmit={addPart} className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="md:col-span-2 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Order</label>
              <input
                value={newPart.order}
                onChange={(e) => setNewPart({ ...newPart, order: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
              <select
                value={newPart.type}
                onChange={(e) => setNewPart({ ...newPart, type: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              >
                {["TEXT","AUDIO","VIDEO","FLASHCARD_LIST","EXERCISE","QUIZ","INTERACTIVE"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
            <input
              value={newPart.title}
              onChange={(e) => setNewPart({ ...newPart, title: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              placeholder="e.g. Introduction"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (s)</label>
            <input
              value={newPart.duration}
              onChange={(e) => setNewPart({ ...newPart, duration: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              placeholder="e.g. 90"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Audio URL</label>
            <input
              value={newPart.audioUrl}
              onChange={(e) => setNewPart({ ...newPart, audioUrl: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              placeholder="https://…"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Video URL</label>
            <input
              value={newPart.videoUrl}
              onChange={(e) => setNewPart({ ...newPart, videoUrl: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              placeholder="https://…"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Text content (markdown)</label>
            <textarea
              value={newPart.content}
              onChange={(e) => setNewPart({ ...newPart, content: e.target.value })}
              rows={4}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              placeholder="Write intro text…"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={busy === "part"}
              className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {busy === "part" ? "Saving…" : "Add part"}
            </button>
          </div>
        </form>
      </div>

      {/* Flashcards */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Flashcards</h2>
            <p className="text-sm text-slate-600">Front/back + optional image/audio URLs.</p>
          </div>
          <span className="text-sm text-slate-500">
            {(lesson.flashcards ?? []).length} total
          </span>
        </div>

        <div className="space-y-2">
          {(lesson.flashcards ?? []).map((c: any) => (
            <div key={c.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
              {editingCardId === c.id && cardDraft ? (
                <div className="w-full space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <input value={cardDraft.order} onChange={(e) => setCardDraft({ ...cardDraft, order: e.target.value })} className="border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-900" />
                    <input value={cardDraft.difficulty} onChange={(e) => setCardDraft({ ...cardDraft, difficulty: e.target.value })} className="border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-900" />
                    <input value={cardDraft.category} onChange={(e) => setCardDraft({ ...cardDraft, category: e.target.value })} placeholder="category" className="border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-900" />
                  </div>
                  <input value={cardDraft.frontText} onChange={(e) => setCardDraft({ ...cardDraft, frontText: e.target.value })} placeholder="Front" className="w-full border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-900" />
                  <input value={cardDraft.backText} onChange={(e) => setCardDraft({ ...cardDraft, backText: e.target.value })} placeholder="Back" className="w-full border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-900" />
                  <input value={cardDraft.imageUrl} onChange={(e) => setCardDraft({ ...cardDraft, imageUrl: e.target.value })} placeholder="Image URL" className="w-full border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-900" />
                  <input value={cardDraft.audioUrl} onChange={(e) => setCardDraft({ ...cardDraft, audioUrl: e.target.value })} placeholder="Audio URL" className="w-full border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-900" />
                  <input value={cardDraft.example} onChange={(e) => setCardDraft({ ...cardDraft, example: e.target.value })} placeholder="Example" className="w-full border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-900" />
                  <label className="text-xs text-slate-700 flex items-center gap-2">
                    <input type="checkbox" checked={cardDraft.isActive} onChange={(e) => setCardDraft({ ...cardDraft, isActive: e.target.checked })} />
                    Active
                  </label>
                  <div className="flex gap-3 justify-end">
                    <button type="button" onClick={() => { setEditingCardId(null); setCardDraft(null); }} className="text-xs font-semibold text-slate-600 hover:underline">Cancel</button>
                    <button type="button" disabled={busy === "card"} onClick={() => saveCard(c.id)} className="text-xs font-semibold text-indigo-700 hover:underline">Save</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {c.order}. {c.frontText} → {c.backText}
                    </div>
                    <div className="text-xs text-slate-600">
                      {c.imageUrl ? "image " : ""}
                      {c.audioUrl ? "audio " : ""}
                      {!c.isActive ? "• Inactive" : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={busy === "card"}
                      onClick={() => startEditCard(c)}
                      className="text-xs font-semibold text-indigo-700 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={busy === "card"}
                      onClick={() => deactivateFlashcard(c.id)}
                      className="text-xs font-semibold text-rose-700 hover:underline"
                    >
                      Deactivate
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {(lesson.flashcards ?? []).length === 0 && (
            <p className="text-sm text-slate-500">No flashcards yet.</p>
          )}
        </div>

        <form onSubmit={addFlashcard} className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Order</label>
            <input
              value={newCard.order}
              onChange={(e) => setNewCard({ ...newCard, order: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty</label>
            <input
              value={newCard.difficulty}
              onChange={(e) => setNewCard({ ...newCard, difficulty: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Front *</label>
            <input
              required
              value={newCard.frontText}
              onChange={(e) => setNewCard({ ...newCard, frontText: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Back *</label>
            <input
              required
              value={newCard.backText}
              onChange={(e) => setNewCard({ ...newCard, backText: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Example</label>
            <input
              value={newCard.example}
              onChange={(e) => setNewCard({ ...newCard, example: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL</label>
            <input
              value={newCard.imageUrl}
              onChange={(e) => setNewCard({ ...newCard, imageUrl: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              placeholder="https://…"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Audio URL</label>
            <input
              value={newCard.audioUrl}
              onChange={(e) => setNewCard({ ...newCard, audioUrl: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              placeholder="https://…"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
            <input
              value={newCard.category}
              onChange={(e) => setNewCard({ ...newCard, category: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={busy === "card"}
              className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {busy === "card" ? "Saving…" : "Add flashcard"}
            </button>
          </div>
        </form>
      </div>

      {/* Exercises */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Exercises</h2>
            <p className="text-sm text-slate-600">Question + JSON options (for MCQ/MATCHING).</p>
          </div>
          <span className="text-sm text-slate-500">
            {(lesson.exercises ?? []).length} total
          </span>
        </div>

        <div className="space-y-2">
          {(lesson.exercises ?? []).map((ex: any) => (
            <div key={ex.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
              {editingExId === ex.id && exDraft ? (
                <div className="w-full space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <input value={exDraft.order} onChange={(e) => setExDraft({ ...exDraft, order: e.target.value })} className="border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-900" />
                    <select value={exDraft.type} onChange={(e) => setExDraft({ ...exDraft, type: e.target.value })} className="border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-900">
                      {["MCQ","FILL","MATCHING","LISTENING","SPEAKING","TRANSLATION","ORDERING"].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input value={exDraft.difficulty} onChange={(e) => setExDraft({ ...exDraft, difficulty: e.target.value })} placeholder="diff" className="border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-900" />
                  </div>
                  <textarea value={exDraft.question} onChange={(e) => setExDraft({ ...exDraft, question: e.target.value })} rows={2} className="w-full border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-900" />
                  <textarea value={exDraft.options} onChange={(e) => setExDraft({ ...exDraft, options: e.target.value })} rows={3} className="w-full font-mono border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-900" placeholder="Options JSON" />
                  <div className="grid grid-cols-2 gap-2">
                    <input value={exDraft.answer} onChange={(e) => setExDraft({ ...exDraft, answer: e.target.value })} placeholder="Answer" className="border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-900" />
                    <input value={exDraft.points} onChange={(e) => setExDraft({ ...exDraft, points: e.target.value })} placeholder="Points" className="border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-900" />
                    <input value={exDraft.timeLimit} onChange={(e) => setExDraft({ ...exDraft, timeLimit: e.target.value })} placeholder="Time limit" className="border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-900" />
                    <input value={exDraft.imageUrl} onChange={(e) => setExDraft({ ...exDraft, imageUrl: e.target.value })} placeholder="Image URL" className="border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-900" />
                  </div>
                  <input value={exDraft.audioUrl} onChange={(e) => setExDraft({ ...exDraft, audioUrl: e.target.value })} placeholder="Audio URL" className="w-full border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-900" />
                  <textarea value={exDraft.explanation} onChange={(e) => setExDraft({ ...exDraft, explanation: e.target.value })} rows={2} placeholder="Explanation" className="w-full border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-900" />
                  <label className="text-xs text-slate-700 flex items-center gap-2">
                    <input type="checkbox" checked={exDraft.isActive} onChange={(e) => setExDraft({ ...exDraft, isActive: e.target.checked })} />
                    Active
                  </label>
                  <div className="flex gap-3 justify-end">
                    <button type="button" onClick={() => { setEditingExId(null); setExDraft(null); }} className="text-xs font-semibold text-slate-600 hover:underline">Cancel</button>
                    <button type="button" disabled={busy === "ex"} onClick={() => saveExercise(ex.id)} className="text-xs font-semibold text-indigo-700 hover:underline">Save</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {ex.order}. [{ex.type}] {ex.question}
                    </div>
                    <div className="text-xs text-slate-600">
                      {ex.points} XP • diff {ex.difficulty}{" "}
                      {ex.timeLimit ? `• ${ex.timeLimit}s` : ""}{" "}
                      {!ex.isActive ? "• Inactive" : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={busy === "ex"}
                      onClick={() => startEditExercise(ex)}
                      className="text-xs font-semibold text-indigo-700 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={busy === "ex"}
                      onClick={() => deactivateExercise(ex.id)}
                      className="text-xs font-semibold text-rose-700 hover:underline"
                    >
                      Deactivate
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {(lesson.exercises ?? []).length === 0 && (
            <p className="text-sm text-slate-500">No exercises yet.</p>
          )}
        </div>

        <form onSubmit={addExercise} className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Order</label>
            <input
              value={newEx.order}
              onChange={(e) => setNewEx({ ...newEx, order: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
            <select
              value={newEx.type}
              onChange={(e) => setNewEx({ ...newEx, type: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            >
              {["MCQ","FILL","MATCHING","LISTENING","SPEAKING","TRANSLATION","ORDERING"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Question *</label>
            <textarea
              required
              value={newEx.question}
              onChange={(e) => setNewEx({ ...newEx, question: e.target.value })}
              rows={3}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Options (JSON)</label>
            <textarea
              value={newEx.options}
              onChange={(e) => setNewEx({ ...newEx, options: e.target.value })}
              rows={4}
              className="w-full font-mono text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              placeholder='For MCQ: [{"text":"A","correct":true},{"text":"B","correct":false}]\nFor MATCHING: [{"left":"ahoj","right":"hello"}]'
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Answer</label>
            <input
              value={newEx.answer}
              onChange={(e) => setNewEx({ ...newEx, answer: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Points</label>
            <input
              value={newEx.points}
              onChange={(e) => setNewEx({ ...newEx, points: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty</label>
            <input
              value={newEx.difficulty}
              onChange={(e) => setNewEx({ ...newEx, difficulty: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Time limit (s)</label>
            <input
              value={newEx.timeLimit}
              onChange={(e) => setNewEx({ ...newEx, timeLimit: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              placeholder="e.g. 60"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL</label>
            <input
              value={newEx.imageUrl}
              onChange={(e) => setNewEx({ ...newEx, imageUrl: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              placeholder="https://…"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Audio URL</label>
            <input
              value={newEx.audioUrl}
              onChange={(e) => setNewEx({ ...newEx, audioUrl: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              placeholder="https://…"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Explanation</label>
            <textarea
              value={newEx.explanation}
              onChange={(e) => setNewEx({ ...newEx, explanation: e.target.value })}
              rows={3}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={busy === "ex"}
              className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {busy === "ex" ? "Saving…" : "Add exercise"}
            </button>
          </div>
        </form>
      </div>

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
