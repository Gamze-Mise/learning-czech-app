import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { ExerciseType } from "@prisma/client";
import { internalError, jsonError, jsonOk, logApiError } from "@/lib/api-response";

type Ctx = { params: Promise<{ lessonId: string; exerciseId: string }> };

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

