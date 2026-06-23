import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { ExerciseType, Prisma } from "@prisma/client";
import { internalError, jsonError, jsonOk, logApiError } from "@/lib/api-response";
import { parseOptionsFromBody } from "@/lib/exercises/options";
import { validateExercise } from "@/lib/exercises/validation";

type Ctx = { params: Promise<{ lessonId: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { session, response } = await requireAdminSession();
  if (!session) return response!;

  const { lessonId } = await ctx.params;
  const id = Number(lessonId);
  if (!Number.isFinite(id)) return jsonError("Invalid lessonId", 400);

  try {
    const exercises = await prisma.exercise.findMany({
      where: { lessonId: id },
      orderBy: { order: "asc" },
    });
    return jsonOk({ exercises });
  } catch (e) {
    logApiError("admin/lessons/[lessonId]/exercises GET", e);
    return internalError();
  }
}

export async function POST(request: NextRequest, ctx: Ctx) {
  const { session, response } = await requireAdminSession();
  if (!session) return response!;

  const { lessonId } = await ctx.params;
  const id = Number(lessonId);
  if (!Number.isFinite(id)) return jsonError("Invalid lessonId", 400);

  try {
    const body = await request.json();
    let order = body.order != null ? Number(body.order) : NaN;
    const type = (String(body.type ?? "MCQ") as ExerciseType) ?? "MCQ";
    const question = String(body.question ?? "").trim();
    const answer = body.answer != null && String(body.answer).trim() ? String(body.answer).trim() : null;
    const explanation =
      body.explanation != null && String(body.explanation).trim()
        ? String(body.explanation).trim()
        : null;
    const difficulty = Number(body.difficulty ?? 1);
    const points = Number(body.points ?? 1);
    const timeLimit = body.timeLimit != null && String(body.timeLimit) !== "" ? Number(body.timeLimit) : null;
    const audioUrl = body.audioUrl != null && String(body.audioUrl).trim() ? String(body.audioUrl).trim() : null;
    const imageUrl = body.imageUrl != null && String(body.imageUrl).trim() ? String(body.imageUrl).trim() : null;
    const isActive = body.isActive !== false;

    const parsedOptions = parseOptionsFromBody(body.options);
    if (parsedOptions.error) return jsonError(parsedOptions.error, 400);
    const options = parsedOptions.options;

    if (!question) return jsonError("question is required", 400);

    const lesson = await prisma.lesson.findUnique({ where: { id } });
    if (!lesson) return jsonError("Lesson not found", 404);

    const validationError = validateExercise(type, answer, options);
    if (validationError) return jsonError(validationError, 400);

    if (!Number.isFinite(order)) {
      const agg = await prisma.exercise.aggregate({
        where: { lessonId: id },
        _max: { order: true },
      });
      order = (agg._max.order ?? 0) + 1;
    }

    const exercise = await prisma.exercise.create({
      data: {
        lessonId: id,
        order,
        type,
        question,
        options: options as Prisma.InputJsonValue,
        answer,
        explanation,
        audioUrl,
        imageUrl,
        difficulty: Number.isFinite(difficulty) ? difficulty : 1,
        points: Number.isFinite(points) ? points : 1,
        timeLimit: Number.isFinite(timeLimit) ? timeLimit : null,
        isActive,
      },
    });
    return jsonOk({ exercise });
  } catch (e) {
    logApiError("admin/lessons/[lessonId]/exercises POST", e);
    return internalError();
  }
}
