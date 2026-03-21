import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { internalError, jsonOk, logApiError } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await context.params;

    const flashcards = await prisma.flashcard.findMany({
      where: {
        lessonId: parseInt(lessonId),
        isActive: true,
      },
      orderBy: { order: "asc" },
    });

    return jsonOk({ flashcards });
  } catch (error) {
    logApiError("flashcards/[lessonId]", error);
    return internalError();
  }
}
