import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { ExerciseType } from "@prisma/client";
import { internalError, jsonError, jsonOk, logApiError } from "@/lib/api-response";

type Ctx = { params: Promise<{ lessonId: string; exerciseId: string }> };

function isMcqLike(type: ExerciseType): boolean {
  return type === "MCQ" || type === "LISTENING";
}

function isFillLike(type: ExerciseType): boolean {
  return type === "FILL" || type === "TRANSLATION";
}

function validateExercise(type: ExerciseType, answer: string | null, options: any): string | null {
  if (isFillLike(type)) {
    if (!answer || !answer.trim()) return "Answer is required for this exercise type.";
  }

  if (isMcqLike(type)) {
    if (!Array.isArray(options) || options.length < 2) {
      return "MCQ/LISTENING requires at least 2 options.";
    }
    const correctCount = options.filter((o: any) => o && o.correct === true).length;
    if (correctCount !== 1) return "MCQ/LISTENING requires exactly 1 correct option.";
  }

  if (type === "MATCHING") {
    if (!Array.isArray(options) || options.length < 1) {
      return "MATCHING requires at least 1 pair.";
    }
    const ok = options.every(
      (o: any) =>
        o &&
        typeof o.left === "string" &&
        typeof o.right === "string" &&
        o.left.trim().length > 0 &&
        o.right.trim().length > 0
    );
    if (!ok) return "MATCHING options must be an array of { left, right } with non-empty strings.";
  }

  return null;
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const { session, response } = await requireAdminSession();
  if (!session) return response!;

  const { lessonId, exerciseId } = await ctx.params;
  const lId = Number(lessonId);
  const eId = Number(exerciseId);
  if (!Number.isFinite(lId) || !Number.isFinite(eId)) return jsonError("Invalid id", 400);

  try {
    const body = await request.json();
    const data: Record<string, unknown> = {};
    if (body.order != null) data.order = Number(body.order);
    if (body.type != null) data.type = String(body.type) as ExerciseType;
    if (body.question != null) data.question = String(body.question).trim();
    if (body.answer !== undefined) data.answer = body.answer ? String(body.answer).trim() : null;
    if (body.explanation !== undefined) data.explanation = body.explanation ? String(body.explanation).trim() : null;
    if (body.difficulty != null) data.difficulty = Number(body.difficulty);
    if (body.points != null) data.points = Number(body.points);
    if (body.timeLimit !== undefined)
      data.timeLimit = body.timeLimit != null && String(body.timeLimit) !== "" ? Number(body.timeLimit) : null;
    if (body.audioUrl !== undefined) data.audioUrl = body.audioUrl ? String(body.audioUrl).trim() : null;
    if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl ? String(body.imageUrl).trim() : null;
    if (body.isActive != null) data.isActive = Boolean(body.isActive);

    if (body.options !== undefined) {
      if (!body.options || !String(body.options).trim()) {
        data.options = null;
      } else {
        try {
          data.options = JSON.parse(String(body.options));
        } catch {
          return jsonError("options must be valid JSON", 400);
        }
      }
    }

    const existing = await prisma.exercise.findUnique({
      where: { id: eId, lessonId: lId },
      select: { type: true, options: true, answer: true },
    });
    if (!existing) return jsonError("Exercise not found", 404);

    const finalType = (data.type as ExerciseType | undefined) ?? existing.type;
    const finalOptions = (data.options as any) ?? existing.options;
    const finalAnswer = (data.answer as string | null | undefined) ?? existing.answer;
    const validationError = validateExercise(finalType, finalAnswer, finalOptions);
    if (validationError) return jsonError(validationError, 400);

    const exercise = await prisma.exercise.update({
      where: { id: eId, lessonId: lId },
      data,
    });
    return jsonOk({ exercise });
  } catch (e) {
    logApiError("admin/lessons/[lessonId]/exercises/[exerciseId] PATCH", e);
    return internalError();
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { session, response } = await requireAdminSession();
  if (!session) return response!;

  const { lessonId, exerciseId } = await ctx.params;
  const lId = Number(lessonId);
  const eId = Number(exerciseId);
  if (!Number.isFinite(lId) || !Number.isFinite(eId)) return jsonError("Invalid id", 400);

  try {
    await prisma.exercise.update({
      where: { id: eId, lessonId: lId },
      data: { isActive: false },
    });
    return jsonOk({ ok: true as const });
  } catch (e) {
    logApiError("admin/lessons/[lessonId]/exercises/[exerciseId] DELETE", e);
    return internalError();
  }
}

