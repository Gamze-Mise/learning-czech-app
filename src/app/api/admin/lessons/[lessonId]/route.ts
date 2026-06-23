import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { LessonType } from "@prisma/client";
import { internalError, jsonError, jsonOk, logApiError } from "@/lib/api-response";
import { parseRouteId } from "@/lib/api/parse-id";

type Ctx = { params: Promise<{ lessonId: string }> };

export async function GET(_request: NextRequest, ctx: Ctx) {
  const { session, response } = await requireAdminSession();
  if (!session) return response!;

  const { lessonId: idParam } = await ctx.params;
  const parsed = parseRouteId(idParam);
  if ("error" in parsed) return jsonError(parsed.error, 400);
  const lessonId = parsed.id;

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        unit: true,
        parts: { orderBy: { order: "asc" } },
        flashcards: { orderBy: { order: "asc" } },
        exercises: { orderBy: { order: "asc" } },
      },
    });

    if (!lesson) {
      return jsonError("Not found", 404);
    }

    return jsonOk({ lesson });
  } catch (error) {
    logApiError("admin/lessons/[lessonId] GET", error);
    return internalError();
  }
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const { session, response } = await requireAdminSession();
  if (!session) return response!;

  const { lessonId: idParam } = await ctx.params;
  const parsed = parseRouteId(idParam);
  if ("error" in parsed) return jsonError(parsed.error, 400);
  const lessonId = parsed.id;

  try {
    const body = await request.json();
    const data: Record<string, unknown> = {};

    if (body.title != null) data.title = String(body.title).trim();
    if (body.order != null) data.order = Number(body.order);
    if (body.description !== undefined)
      data.description = body.description
        ? String(body.description).trim()
        : null;
    if (body.type != null) data.type = body.type as LessonType;
    if (body.difficulty != null) data.difficulty = Number(body.difficulty);
    if (body.estimatedTime !== undefined)
      data.estimatedTime =
        body.estimatedTime != null ? Number(body.estimatedTime) : null;
    if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);
    if (body.unitId != null) data.unitId = Number(body.unitId);
    if (body.thumbnail !== undefined)
      data.thumbnail = body.thumbnail
        ? String(body.thumbnail).trim()
        : null;

    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data,
      include: {
        unit: true,
        parts: { orderBy: { order: "asc" } },
        flashcards: { orderBy: { order: "asc" } },
        exercises: { orderBy: { order: "asc" } },
      },
    });

    return jsonOk({ lesson });
  } catch (e) {
    logApiError("admin/lessons/[lessonId] PATCH", e);
    return internalError();
  }
}

export async function DELETE(_request: NextRequest, ctx: Ctx) {
  const { session, response } = await requireAdminSession();
  if (!session) return response!;

  const { lessonId: idParam } = await ctx.params;
  const parsed = parseRouteId(idParam);
  if ("error" in parsed) return jsonError(parsed.error, 400);
  const lessonId = parsed.id;

  try {
    await prisma.lesson.update({
      where: { id: lessonId },
      data: { isActive: false },
    });

    return jsonOk({ ok: true as const });
  } catch (error) {
    logApiError("admin/lessons/[lessonId] DELETE", error);
    return internalError();
  }
}
