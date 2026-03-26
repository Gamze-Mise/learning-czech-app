import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { PartType } from "@prisma/client";
import { internalError, jsonError, jsonOk, logApiError } from "@/lib/api-response";

type Ctx = { params: Promise<{ lessonId: string; partId: string }> };

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const { session, response } = await requireAdminSession();
  if (!session) return response!;

  const { lessonId, partId } = await ctx.params;
  const lId = Number(lessonId);
  const pId = Number(partId);
  if (!Number.isFinite(lId) || !Number.isFinite(pId)) {
    return jsonError("Invalid id", 400);
  }

  try {
    const body = await request.json();
    const data: Record<string, unknown> = {};
    if (body.order != null) data.order = Number(body.order);
    if (body.type != null) data.type = String(body.type) as PartType;
    if (body.title !== undefined)
      data.title = body.title ? String(body.title).trim() : null;
    if (body.duration !== undefined)
      data.duration = body.duration != null && String(body.duration) !== "" ? Number(body.duration) : null;
    if (body.audioUrl !== undefined)
      data.audioUrl = body.audioUrl ? String(body.audioUrl).trim() : null;
    if (body.videoUrl !== undefined)
      data.videoUrl = body.videoUrl ? String(body.videoUrl).trim() : null;
    if (body.isActive != null) data.isActive = Boolean(body.isActive);
    if (body.content !== undefined) {
      data.content =
        body.content && String(body.content).trim()
          ? { markdown: String(body.content) }
          : null;
    }

    const part = await prisma.lessonPart.update({
      where: { id: pId, lessonId: lId },
      data,
    });
    return jsonOk({ part });
  } catch (e) {
    logApiError("admin/lessons/[lessonId]/parts/[partId] PATCH", e);
    return internalError();
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { session, response } = await requireAdminSession();
  if (!session) return response!;

  const { lessonId, partId } = await ctx.params;
  const lId = Number(lessonId);
  const pId = Number(partId);
  if (!Number.isFinite(lId) || !Number.isFinite(pId)) {
    return jsonError("Invalid id", 400);
  }

  try {
    await prisma.lessonPart.update({
      where: { id: pId, lessonId: lId },
      data: { isActive: false },
    });
    return jsonOk({ ok: true as const });
  } catch (e) {
    logApiError("admin/lessons/[lessonId]/parts/[partId] DELETE", e);
    return internalError();
  }
}

