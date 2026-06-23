import { buildExerciseApiPayload } from "@/lib/exercises/api-payload";
import type { ExerciseFormState } from "@/lib/exercises/types";
import type { LessonDetail } from "@/lib/lessons/types";
import type { NewCardState, NewExState, NewPartState } from "@/lib/lessons/admin-form-types";

type ApiError = { ok: false; error: string };
type ApiOk<T> = { ok: true; data: T };

export async function fetchLesson(lessonId: string): Promise<
  ApiOk<{ lesson: LessonDetail }> | ApiError
> {
  const res = await fetch(`/api/admin/lessons/${lessonId}`);
  const data = await res.json();
  if (!res.ok) {
    return { ok: false, error: "Not found" };
  }
  return { ok: true, data: { lesson: data.lesson as LessonDetail } };
}

export async function refreshLesson(lessonId: string): Promise<LessonDetail | null> {
  const res = await fetch(`/api/admin/lessons/${lessonId}`);
  const data = await res.json();
  if (!res.ok) return null;
  return data.lesson as LessonDetail;
}

export async function updateLessonMetadata(
  lessonId: string,
  payload: {
    title: string;
    order: number;
    description: string | null;
    type: string;
    difficulty: number;
    estimatedTime: number | null;
    isActive: boolean;
    thumbnail: string | null;
  }
): Promise<ApiOk<{ lesson: LessonDetail }> | ApiError> {
  const res = await fetch(`/api/admin/lessons/${lessonId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    return { ok: false, error: data.error ?? "Update failed" };
  }
  return { ok: true, data: { lesson: data.lesson as LessonDetail } };
}

export async function deactivateLesson(lessonId: string): Promise<void> {
  await fetch(`/api/admin/lessons/${lessonId}`, { method: "DELETE" });
}

export async function createPart(
  lessonId: number,
  newPart: NewPartState,
  nextOrder: number
): Promise<ApiOk<unknown> | ApiError> {
  const res = await fetch(`/api/admin/lessons/${lessonId}/parts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      order: nextOrder,
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
    return { ok: false, error: data.error ?? "Failed to add part" };
  }
  return { ok: true, data };
}

export async function updatePart(
  lessonId: number,
  partId: number,
  partDraft: Record<string, unknown>
): Promise<ApiOk<unknown> | ApiError> {
  const res = await fetch(`/api/admin/lessons/${lessonId}/parts/${partId}`, {
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
    return { ok: false, error: data.error ?? "Failed to update part" };
  }
  return { ok: true, data };
}

export async function deactivatePart(lessonId: number, partId: number): Promise<void> {
  await fetch(`/api/admin/lessons/${lessonId}/parts/${partId}`, { method: "DELETE" });
}

export async function createFlashcard(
  lessonId: number,
  newCard: NewCardState,
  nextOrder: number
): Promise<ApiOk<unknown> | ApiError> {
  const res = await fetch(`/api/admin/lessons/${lessonId}/flashcards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      order: nextOrder,
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
    return { ok: false, error: data.error ?? "Failed to add flashcard" };
  }
  return { ok: true, data };
}

export async function updateFlashcard(
  lessonId: number,
  cardId: number,
  cardDraft: Record<string, unknown>
): Promise<ApiOk<unknown> | ApiError> {
  const res = await fetch(`/api/admin/lessons/${lessonId}/flashcards/${cardId}`, {
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
  });
  const data = await res.json();
  if (!res.ok) {
    return { ok: false, error: data.error ?? "Failed to update flashcard" };
  }
  return { ok: true, data };
}

export async function deactivateFlashcard(
  lessonId: number,
  flashcardId: number
): Promise<void> {
  await fetch(`/api/admin/lessons/${lessonId}/flashcards/${flashcardId}`, {
    method: "DELETE",
  });
}

export async function createExercise(
  lessonId: number,
  newEx: NewExState,
  nextOrder: number
): Promise<ApiOk<unknown> | ApiError> {
  const res = await fetch(`/api/admin/lessons/${lessonId}/exercises`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      buildExerciseApiPayload({ ...newEx, isActive: true }, { order: nextOrder })
    ),
  });
  const data = await res.json();
  if (!res.ok) {
    return { ok: false, error: data.error ?? "Failed to add exercise" };
  }
  return { ok: true, data };
}

export async function updateExercise(
  lessonId: number,
  exerciseId: number,
  exDraft: Record<string, unknown>
): Promise<ApiOk<unknown> | ApiError> {
  const res = await fetch(`/api/admin/lessons/${lessonId}/exercises/${exerciseId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      buildExerciseApiPayload({
        ...(exDraft as ExerciseFormState),
        order: String(exDraft.order ?? 1),
        isActive: Boolean(exDraft.isActive),
      })
    ),
  });
  const data = await res.json();
  if (!res.ok) {
    return { ok: false, error: data.error ?? "Failed to update exercise" };
  }
  return { ok: true, data };
}

export async function deactivateExercise(
  lessonId: number,
  exerciseId: number
): Promise<void> {
  await fetch(`/api/admin/lessons/${lessonId}/exercises/${exerciseId}`, {
    method: "DELETE",
  });
}
