import { allowExerciseAudio, allowExerciseTimeLimit } from "./admin-rules";
import type { ExerciseFormState } from "./types";

export function buildExerciseApiPayload(
  form: ExerciseFormState,
  extra?: { order?: number }
): Record<string, unknown> {
  const allowAudio = allowExerciseAudio(form.type);
  const allowTimeLimit = allowExerciseTimeLimit(form.type);

  return {
    ...(extra?.order != null
      ? { order: extra.order }
      : form.order != null
        ? { order: Number(form.order) || 1 }
        : {}),
    type: form.type,
    question: form.question,
    options: form.options || null,
    answer: form.answer || null,
    explanation: form.explanation || null,
    points: Number(form.points) || 1,
    difficulty: Number(form.difficulty) || 1,
    timeLimit: allowTimeLimit && form.timeLimit ? Number(form.timeLimit) : null,
    audioUrl: allowAudio ? form.audioUrl || null : null,
    imageUrl: form.imageUrl || null,
    ...(form.isActive != null ? { isActive: form.isActive } : {}),
  };
}
