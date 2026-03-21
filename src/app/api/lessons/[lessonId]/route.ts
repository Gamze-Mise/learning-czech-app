import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { internalError, jsonData, jsonError, logApiError } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await context.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(lessonId) },
      include: {
        unit: {
          include: {
            course: true,
          },
        },
        parts: {
          orderBy: { order: "asc" },
        },
        flashcards: {
          orderBy: { order: "asc" },
        },
        exercises: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!lesson) {
      return jsonError("Lesson not found", 404);
    }

    return jsonData(lesson);
  } catch (error) {
    logApiError("lessons/[lessonId]", error);
    return internalError();
  }
}
