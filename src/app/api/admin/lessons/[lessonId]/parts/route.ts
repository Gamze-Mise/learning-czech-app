import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { PartType } from "@prisma/client";
import { internalError, jsonError, jsonOk, logApiError } from "@/lib/api-response";

type Ctx = { params: Promise<{ lessonId: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { session, response } = await requireAdminSession();
  if (!session) return response!;

  const { lessonId } = await ctx.params;
  const id = Number(lessonId);
  if (!Number.isFinite(id)) return jsonError("Invalid lessonId", 400);

  try {
    const parts = await prisma.lessonPart.findMany({
      where: { lessonId: id },
      orderBy: { order: "asc" },
    });
    return jsonOk({ parts });
  } catch (e) {
    logApiError("admin/lessons/[lessonId]/parts GET", e);
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
    const order = Number(body.order ?? 1);
    const type = (String(body.type ?? "TEXT") as PartType) ?? "TEXT";
    const title = body.title != null && String(body.title).trim() ? String(body.title).trim() : null;
    const duration = body.duration != null && String(body.duration) !== "" ? Number(body.duration) : null;
    const audioUrl = body.audioUrl != null && String(body.audioUrl).trim() ? String(body.audioUrl).trim() : null;
    const videoUrl = body.videoUrl != null && String(body.videoUrl).trim() ? String(body.videoUrl).trim() : null;
    const isActive = body.isActive !== false;

    let content: any = null;
    if (body.content != null && String(body.content).trim()) {
      // store as { markdown: string } so learner UI can render it
      content = { markdown: String(body.content) };
    }

    const lesson = await prisma.lesson.findUnique({ where: { id } });
    if (!lesson) return jsonError("Lesson not found", 404);

    const part = await prisma.lessonPart.create({
      data: {
        lessonId: id,
        order,
        type,
        title,
        content,
        audioUrl,
        videoUrl,
        duration: Number.isFinite(duration) ? duration : null,
        isActive,
      },
    });
    return jsonOk({ part });
  } catch (e) {
    logApiError("admin/lessons/[lessonId]/parts POST", e);
    return internalError();
  }
}

