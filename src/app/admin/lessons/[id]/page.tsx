"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminPageHeader, {
  adminPrimaryButtonClass,
} from "@/components/admin/AdminPageHeader";
import AdminImageField from "@/components/admin/AdminImageField";
import LessonPartsPanel from "./LessonPartsPanel";
import LessonFlashcardsPanel from "./LessonFlashcardsPanel";
import LessonExercisesPanel from "./LessonExercisesPanel";

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
  thumbnail: string | null;
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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccessOpen, setSaveSuccessOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!saveSuccessOpen) return;
    const t = window.setTimeout(() => {
      setSaveSuccessOpen(false);
    }, 2200);
    return () => window.clearTimeout(t);
  }, [saveSuccessOpen]);

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
      .catch(() => setLoadError("Lesson not found"))
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
    setSaveError(null);
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
        setSaveError(data.error ?? "Failed to add part");
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
      setSaveError("Network error");
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
    setSaveError(null);
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
        setSaveError(data.error ?? "Failed to update part");
        return;
      }
      setEditingPartId(null);
      setPartDraft(null);
      await refreshLesson();
    } catch {
      setSaveError("Network error");
    } finally {
      setBusy(null);
    }
  }

  async function addFlashcard(e: React.FormEvent) {
    e.preventDefault();
    if (!lesson) return;
    setBusy("card");
    setSaveError(null);
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
        setSaveError(data.error ?? "Failed to add flashcard");
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
      setSaveError("Network error");
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
    setSaveError(null);
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
        setSaveError(data.error ?? "Failed to update flashcard");
        return;
      }
      setEditingCardId(null);
      setCardDraft(null);
      await refreshLesson();
    } catch {
      setSaveError("Network error");
    } finally {
      setBusy(null);
    }
  }

  async function addExercise(e: React.FormEvent) {
    e.preventDefault();
    if (!lesson) return;
    setBusy("ex");
    setSaveError(null);
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
        setSaveError(data.error ?? "Failed to add exercise");
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
      setSaveError("Network error");
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
    setSaveError(null);
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
        setSaveError(data.error ?? "Failed to update exercise");
        return;
      }
      setEditingExId(null);
      setExDraft(null);
      await refreshLesson();
    } catch {
      setSaveError("Network error");
    } finally {
      setBusy(null);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!lesson) return;
    setSaving(true);
    setSaveError(null);
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
          thumbnail: lesson.thumbnail?.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error ?? "Update failed");
        return;
      }
      setLesson(data.lesson);
      setSaveSuccessOpen(true);
    } catch {
      setSaveError("Network error");
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
  if (loadError || !lesson) {
    return (
      <div>
        <p className="text-red-600">{loadError ?? "Not found"}</p>
        <Link href="/admin/lessons" className="text-blue-600">
          ← Back
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      {saveSuccessOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lesson-save-success-title"
        >
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl ring-1 ring-black/5 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="absolute inset-0 rounded-full bg-emerald-500/20 motion-safe:animate-ping" />
                <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow motion-safe:animate-bounce">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path
                      fillRule="evenodd"
                      d="M16.704 5.29a1 1 0 0 1 .006 1.415l-7.5 7.6a1 1 0 0 1-1.42.004L3.296 9.814a1 1 0 1 1 1.408-1.42l3.083 3.06 6.793-6.887a1 1 0 0 1 1.424.723Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
              <div>
                <h2
                  id="lesson-save-success-title"
                  className="text-base font-semibold text-slate-900"
                >
                  Saved
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Changes applied</p>
              </div>
            </div>
            <button
              type="button"
              className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-center text-sm font-medium text-white hover:bg-slate-800"
              onClick={() => setSaveSuccessOpen(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <AdminPageHeader
        title="Edit lesson"
        description={`Unit: ${lesson.unit.title} (ID ${lesson.unitId})`}
        action={
          <Link href="/admin/lessons" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Back
          </Link>
        }
      />

      <form
        onSubmit={onSubmit}
        className="space-y-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm"
      >
        {saveError && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{saveError}</p>
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
        <AdminImageField
          label="Lesson cover"
          value={lesson.thumbnail ?? ""}
          onChange={(v) => setLesson({ ...lesson, thumbnail: v.trim() || null })}
          description="Shown in lists where a thumbnail is used. Upload or paste a URL."
        />
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-slate-900">Status</p>
            <p className="text-xs text-slate-600 mt-0.5">
              {lesson.isActive ? "Active (visible in app)" : "Passive (hidden in app)"}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={lesson.isActive}
            onClick={() => setLesson({ ...lesson, isActive: !lesson.isActive })}
            className={[
              "relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
              lesson.isActive ? "bg-indigo-600" : "bg-slate-300",
            ].join(" ")}
          >
            <span
              className={[
                "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
                lesson.isActive ? "translate-x-6" : "translate-x-1",
              ].join(" ")}
            />
          </button>
        </div>
        <button
          type="submit"
          disabled={saving}
          className={adminPrimaryButtonClass + (saving ? " opacity-60" : "")}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>

      <LessonPartsPanel
        parts={lesson.parts ?? []}
        busyPart={busy === "part"}
        newPart={newPart}
        setNewPart={setNewPart}
        editingPartId={editingPartId}
        partDraft={partDraft}
        setPartDraft={setPartDraft}
        onAddPart={addPart}
        onDeactivatePart={deactivatePart}
        onStartEditPart={startEditPart}
        onSavePart={savePart}
        onCancelEditPart={() => {
          setEditingPartId(null);
          setPartDraft(null);
        }}
      />

      <LessonFlashcardsPanel
        flashcards={lesson.flashcards ?? []}
        busyCard={busy === "card"}
        newCard={newCard}
        setNewCard={setNewCard}
        editingCardId={editingCardId}
        cardDraft={cardDraft}
        setCardDraft={setCardDraft}
        onAddFlashcard={addFlashcard}
        onDeactivateFlashcard={deactivateFlashcard}
        onStartEditCard={startEditCard}
        onSaveCard={saveCard}
        onCancelEditCard={() => {
          setEditingCardId(null);
          setCardDraft(null);
        }}
      />

      <LessonExercisesPanel
        exercises={lesson.exercises ?? []}
        busyEx={busy === "ex"}
        newEx={newEx}
        setNewEx={setNewEx}
        editingExId={editingExId}
        exDraft={exDraft}
        setExDraft={setExDraft}
        onAddExercise={addExercise}
        onDeactivateExercise={deactivateExercise}
        onStartEditExercise={startEditExercise}
        onSaveExercise={saveExercise}
        onCancelEditExercise={() => {
          setEditingExId(null);
          setExDraft(null);
        }}
      />

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
