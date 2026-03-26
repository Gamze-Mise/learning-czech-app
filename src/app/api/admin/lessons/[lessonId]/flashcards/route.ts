import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { internalError, jsonError, jsonOk, logApiError } from "@/lib/api-response";

type Ctx = { params: Promise<{ lessonId: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { session, response } = await requireAdminSession();
  if (!session) return response!;

  const { lessonId } = await ctx.params;
  const id = Number(lessonId);
  if (!Number.isFinite(id)) return jsonError("Invalid lessonId", 400);

  try {
    const flashcards = await prisma.flashcard.findMany({
      where: { lessonId: id },
      orderBy: { order: "asc" },
    });
    return jsonOk({ flashcards });
  } catch (e) {
    logApiError("admin/lessons/[lessonId]/flashcards GET", e);
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
    const frontText = String(body.frontText ?? "").trim();
    const backText = String(body.backText ?? "").trim();
    const audioUrl =
      body.audioUrl != null && String(body.audioUrl).trim()
        ? String(body.audioUrl).trim()
        : null;
    const imageUrl =
      body.imageUrl != null && String(body.imageUrl).trim()
        ? String(body.imageUrl).trim()
        : null;
    const example =
      body.example != null && String(body.example).trim()
        ? String(body.example).trim()
        : null;
    const difficulty = Number(body.difficulty ?? 1);
    const category =
      body.category != null && String(body.category).trim()
        ? String(body.category).trim()
        : null;
    const isActive = body.isActive !== false;

    if (!frontText || !backText) return jsonError("frontText and backText are required", 400);

    const lesson = await prisma.lesson.findUnique({ where: { id } });
    if (!lesson) return jsonError("Lesson not found", 404);

    const flashcard = await prisma.flashcard.create({
      data: {
        lessonId: id,
        order,
        frontText,
        backText,
        audioUrl,
        imageUrl,
        example,
        difficulty: Number.isFinite(difficulty) ? difficulty : 1,
        category,
        isActive,
      },
    });
    return jsonOk({ flashcard });
  } catch (e) {
    logApiError("admin/lessons/[lessonId]/flashcards POST", e);
    return internalError();
  }
}

