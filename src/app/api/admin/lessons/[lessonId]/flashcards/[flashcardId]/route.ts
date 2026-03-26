import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { internalError, jsonError, jsonOk, logApiError } from "@/lib/api-response";

type Ctx = { params: Promise<{ lessonId: string; flashcardId: string }> };

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const { session, response } = await requireAdminSession();
  if (!session) return response!;

  const { lessonId, flashcardId } = await ctx.params;
  const lId = Number(lessonId);
  const fId = Number(flashcardId);
  if (!Number.isFinite(lId) || !Number.isFinite(fId)) return jsonError("Invalid id", 400);

  try {
    const body = await request.json();
    const data: Record<string, unknown> = {};
    if (body.order != null) data.order = Number(body.order);
    if (body.frontText != null) data.frontText = String(body.frontText).trim();
    if (body.backText != null) data.backText = String(body.backText).trim();
    if (body.audioUrl !== undefined) data.audioUrl = body.audioUrl ? String(body.audioUrl).trim() : null;
    if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl ? String(body.imageUrl).trim() : null;
    if (body.example !== undefined) data.example = body.example ? String(body.example).trim() : null;
    if (body.difficulty != null) data.difficulty = Number(body.difficulty);
    if (body.category !== undefined) data.category = body.category ? String(body.category).trim() : null;
    if (body.isActive != null) data.isActive = Boolean(body.isActive);

    const flashcard = await prisma.flashcard.update({
      where: { id: fId, lessonId: lId },
      data,
    });
    return jsonOk({ flashcard });
  } catch (e) {
    logApiError("admin/lessons/[lessonId]/flashcards/[flashcardId] PATCH", e);
    return internalError();
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { session, response } = await requireAdminSession();
  if (!session) return response!;

  const { lessonId, flashcardId } = await ctx.params;
  const lId = Number(lessonId);
  const fId = Number(flashcardId);
  if (!Number.isFinite(lId) || !Number.isFinite(fId)) return jsonError("Invalid id", 400);

  try {
    await prisma.flashcard.update({
      where: { id: fId, lessonId: lId },
      data: { isActive: false },
    });
    return jsonOk({ ok: true as const });
  } catch (e) {
    logApiError("admin/lessons/[lessonId]/flashcards/[flashcardId] DELETE", e);
    return internalError();
  }
}

