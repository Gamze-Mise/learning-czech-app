import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { internalError, jsonOk, logApiError } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await context.params;

    const lessonIdNum = parseInt(lessonId);

    const [flashcards, exerciseCount] = await Promise.all([
      prisma.flashcard.findMany({
        where: {
          lessonId: lessonIdNum,
          isActive: true,
        },
        orderBy: { order: "asc" },
      }),
      prisma.exercise.count({
        where: {
          lessonId: lessonIdNum,
          isActive: true,
        },
      }),
    ]);

    return jsonOk({ flashcards, exerciseCount });
  } catch (error) {
    logApiError("flashcards/[lessonId]", error);
    return internalError();
  }
}
