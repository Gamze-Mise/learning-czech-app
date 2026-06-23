"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createExercise,
  createFlashcard,
  createPart,
  deactivateExercise,
  deactivateFlashcard,
  deactivateLesson,
  deactivatePart,
  fetchLesson,
  refreshLesson as refreshLessonData,
  updateExercise,
  updateFlashcard,
  updateLessonMetadata,
  updatePart,
} from "@/lib/admin/lesson-mutations";
import { persistLessonItemOrder } from "@/lib/admin/lesson-order";
import { reorderById } from "@/lib/array/reorder";
import { isPronunciationGuidePart } from "@/lib/lessons/parts";
import type { LessonDetail } from "@/lib/lessons/types";
import {
  EMPTY_CARD,
  EMPTY_EXERCISE,
  EMPTY_PART,
  type NewCardState,
  type NewExState,
  type NewPartState,
} from "@/lib/lessons/admin-form-types";

export function useAdminLessonEditor(lessonId: string) {
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccessOpen, setSaveSuccessOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const [newPart, setNewPart] = useState<NewPartState>(EMPTY_PART);
  const [newCard, setNewCard] = useState<NewCardState>(EMPTY_CARD);
  const [newEx, setNewEx] = useState<NewExState>(EMPTY_EXERCISE);

  const [editingPartId, setEditingPartId] = useState<number | null>(null);
  const [editingCardId, setEditingCardId] = useState<number | null>(null);
  const [editingExId, setEditingExId] = useState<number | null>(null);
  const [partDraft, setPartDraft] = useState<Record<string, unknown> | null>(null);
  const [cardDraft, setCardDraft] = useState<Record<string, unknown> | null>(null);
  const [exDraft, setExDraft] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!saveSuccessOpen) return;
    const t = window.setTimeout(() => setSaveSuccessOpen(false), 2200);
    return () => window.clearTimeout(t);
  }, [saveSuccessOpen]);

  useEffect(() => {
    void fetchLesson(lessonId)
      .then((result) => {
        if (!result.ok) {
          setLoadError("Lesson not found");
          return;
        }
        setLesson(result.data.lesson);
      })
      .catch(() => setLoadError("Lesson not found"))
      .finally(() => setLoading(false));
  }, [lessonId]);

  const refreshLesson = useCallback(async () => {
    const next = await refreshLessonData(lessonId);
    if (next) setLesson(next);
  }, [lessonId]);

  const reorderParts = useCallback(
    async (partId: number, targetIndex: number) => {
      if (!lesson) return;
      const all = Array.isArray(lesson.parts) ? [...lesson.parts] : [];
      const hidden = all.filter(isPronunciationGuidePart);
      const visible = all.filter((p) => !isPronunciationGuidePart(p));
      const reorderedVisible = reorderById(
        visible as Array<{ id: number }>,
        partId,
        targetIndex
      );
      if (reorderedVisible === visible) return;

      const reordered = [...reorderedVisible, ...hidden] as Array<{ id: number }>;

      setBusy("part");
      setSaveError(null);
      try {
        await persistLessonItemOrder(lesson.id, "parts", reordered);
        await refreshLesson();
      } catch {
        setSaveError("Reorder failed (network error).");
      } finally {
        setBusy(null);
      }
    },
    [lesson, refreshLesson]
  );

  const reorderFlashcards = useCallback(
    async (flashcardId: number, targetIndex: number) => {
      if (!lesson) return;
      const all = (Array.isArray(lesson.flashcards) ? [...lesson.flashcards] : []) as Array<{
        id: number;
      }>;
      const next = reorderById(all, flashcardId, targetIndex);
      if (next === all) return;

      setBusy("card");
      setSaveError(null);
      try {
        await persistLessonItemOrder(lesson.id, "flashcards", next);
        await refreshLesson();
      } catch {
        setSaveError("Reorder failed (network error).");
      } finally {
        setBusy(null);
      }
    },
    [lesson, refreshLesson]
  );

  const reorderExercises = useCallback(
    async (exerciseId: number, targetIndex: number) => {
      if (!lesson) return;
      const all = (Array.isArray(lesson.exercises) ? [...lesson.exercises] : []) as Array<{
        id: number;
      }>;
      const next = reorderById(all, exerciseId, targetIndex);
      if (next === all) return;

      setBusy("ex");
      setSaveError(null);
      try {
        await persistLessonItemOrder(lesson.id, "exercises", next);
        await refreshLesson();
      } catch {
        setSaveError("Reorder failed (network error).");
      } finally {
        setBusy(null);
      }
    },
    [lesson, refreshLesson]
  );

  const addPart = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!lesson) return;
      setBusy("part");
      setSaveError(null);
      try {
        const nextOrder = Array.isArray(lesson.parts) ? lesson.parts.length + 1 : 1;
        const result = await createPart(lesson.id, newPart, nextOrder);
        if (!result.ok) {
          setSaveError(result.error);
          return;
        }
        setNewPart(EMPTY_PART);
        await refreshLesson();
      } catch {
        setSaveError("Network error");
      } finally {
        setBusy(null);
      }
    },
    [lesson, newPart, refreshLesson]
  );

  const deactivatePartHandler = useCallback(
    async (partId: number) => {
      if (!lesson) return;
      if (!confirm("Deactivate this part?")) return;
      setBusy("part");
      await deactivatePart(lesson.id, partId);
      await refreshLesson();
      setBusy(null);
    },
    [lesson, refreshLesson]
  );

  const startEditPart = useCallback((part: Record<string, unknown>) => {
    setEditingPartId(part.id as number);
    setPartDraft({
      order: String(part.order ?? 1),
      type: part.type ?? "TEXT",
      title: part.title ?? "",
      duration: part.duration != null ? String(part.duration) : "",
      audioUrl: part.audioUrl ?? "",
      videoUrl: part.videoUrl ?? "",
      content: (part.content as { markdown?: string } | null)?.markdown ?? "",
      isActive: Boolean(part.isActive),
    });
  }, []);

  const savePart = useCallback(
    async (partId: number) => {
      if (!lesson || !partDraft) return;
      setBusy("part");
      setSaveError(null);
      try {
        const result = await updatePart(lesson.id, partId, partDraft);
        if (!result.ok) {
          setSaveError(result.error);
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
    },
    [lesson, partDraft, refreshLesson]
  );

  const addFlashcard = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!lesson) return;
      setBusy("card");
      setSaveError(null);
      try {
        const nextOrder = Array.isArray(lesson.flashcards) ? lesson.flashcards.length + 1 : 1;
        const result = await createFlashcard(lesson.id, newCard, nextOrder);
        if (!result.ok) {
          setSaveError(result.error);
          return;
        }
        setNewCard(EMPTY_CARD);
        await refreshLesson();
      } catch {
        setSaveError("Network error");
      } finally {
        setBusy(null);
      }
    },
    [lesson, newCard, refreshLesson]
  );

  const deactivateFlashcardHandler = useCallback(
    async (flashcardId: number) => {
      if (!lesson) return;
      if (!confirm("Deactivate this flashcard?")) return;
      setBusy("card");
      await deactivateFlashcard(lesson.id, flashcardId);
      await refreshLesson();
      setBusy(null);
    },
    [lesson, refreshLesson]
  );

  const startEditCard = useCallback((card: Record<string, unknown>) => {
    setEditingCardId(card.id as number);
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
  }, []);

  const saveCard = useCallback(
    async (cardId: number) => {
      if (!lesson || !cardDraft) return;
      setBusy("card");
      setSaveError(null);
      try {
        const result = await updateFlashcard(lesson.id, cardId, cardDraft);
        if (!result.ok) {
          setSaveError(result.error);
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
    },
    [lesson, cardDraft, refreshLesson]
  );

  const addExercise = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!lesson) return;
      setBusy("ex");
      setSaveError(null);
      try {
        const nextOrder = Array.isArray(lesson.exercises) ? lesson.exercises.length + 1 : 1;
        const result = await createExercise(lesson.id, newEx, nextOrder);
        if (!result.ok) {
          setSaveError(result.error);
          return;
        }
        setNewEx(EMPTY_EXERCISE);
        await refreshLesson();
      } catch {
        setSaveError("Network error");
      } finally {
        setBusy(null);
      }
    },
    [lesson, newEx, refreshLesson]
  );

  const deactivateExerciseHandler = useCallback(
    async (exerciseId: number) => {
      if (!lesson) return;
      if (!confirm("Deactivate this exercise?")) return;
      setBusy("ex");
      await deactivateExercise(lesson.id, exerciseId);
      await refreshLesson();
      setBusy(null);
    },
    [lesson, refreshLesson]
  );

  const startEditExercise = useCallback((ex: Record<string, unknown>) => {
    setEditingExId(ex.id as number);
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
  }, []);

  const saveExercise = useCallback(
    async (exerciseId: number) => {
      if (!lesson || !exDraft) return;
      setBusy("ex");
      setSaveError(null);
      try {
        const result = await updateExercise(lesson.id, exerciseId, exDraft);
        if (!result.ok) {
          setSaveError(result.error);
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
    },
    [lesson, exDraft, refreshLesson]
  );

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!lesson) return;
      setSaving(true);
      setSaveError(null);
      try {
        const result = await updateLessonMetadata(lessonId, {
          title: lesson.title.trim(),
          order: lesson.order,
          description: lesson.description?.trim() || null,
          type: lesson.type,
          difficulty: lesson.difficulty,
          estimatedTime: lesson.estimatedTime,
          isActive: lesson.isActive,
          thumbnail: lesson.thumbnail?.trim() || null,
        });
        if (!result.ok) {
          setSaveError(result.error);
          return;
        }
        setLesson(result.data.lesson);
        setSaveSuccessOpen(true);
      } catch {
        setSaveError("Network error");
      } finally {
        setSaving(false);
      }
    },
    [lesson, lessonId]
  );

  const deactivateLessonHandler = useCallback(async () => {
    if (!confirm("Deactivate this lesson? It will be hidden in the app.")) return;
    await deactivateLesson(lessonId);
    router.push("/admin/lessons");
  }, [lessonId, router]);

  return {
    lesson,
    setLesson,
    loading,
    loadError,
    saving,
    saveError,
    saveSuccessOpen,
    setSaveSuccessOpen,
    busy,
    newPart,
    setNewPart,
    newCard,
    setNewCard,
    newEx,
    setNewEx,
    editingPartId,
    partDraft,
    setPartDraft,
    editingCardId,
    cardDraft,
    setCardDraft,
    editingExId,
    exDraft,
    setExDraft,
    reorderParts,
    reorderFlashcards,
    reorderExercises,
    addPart,
    deactivatePart: deactivatePartHandler,
    startEditPart,
    savePart,
    cancelEditPart: () => {
      setEditingPartId(null);
      setPartDraft(null);
    },
    addFlashcard,
    deactivateFlashcard: deactivateFlashcardHandler,
    startEditCard,
    saveCard,
    cancelEditCard: () => {
      setEditingCardId(null);
      setCardDraft(null);
    },
    addExercise,
    deactivateExercise: deactivateExerciseHandler,
    startEditExercise,
    saveExercise,
    cancelEditExercise: () => {
      setEditingExId(null);
      setExDraft(null);
    },
    onSubmit,
    deactivateLesson: deactivateLessonHandler,
  };
}
