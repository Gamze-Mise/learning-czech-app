import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { internalError, jsonData, jsonError, logApiError } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ exerciseId: string }> }
) {
  try {
    const { exerciseId } = await context.params;

    const exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(exerciseId) },
    });

    if (!exercise) {
      return jsonError("Exercise not found", 404);
    }

    const parsedExercise = {
      ...exercise,
      options: exercise.options || [],
      answer: exercise.answer || "",
      explanation: exercise.explanation || "",
    };

    return jsonData(parsedExercise);
  } catch (error) {
    logApiError("exercises/[exerciseId]", error);
    return internalError();
  }
}
