import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { internalError, jsonOk, logApiError } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await context.params;

    const exercises = await prisma.exercise.findMany({
      where: {
        lessonId: parseInt(lessonId),
        isActive: true,
      },
      orderBy: { order: "asc" },
    });

    return jsonOk({ exercises });
  } catch (error) {
    logApiError("exercises/lesson/[lessonId]", error);
    return internalError();
  }
}
