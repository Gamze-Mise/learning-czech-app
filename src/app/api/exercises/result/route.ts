import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromCookies } from "@/lib/auth/session";
import { internalError, jsonError, jsonOk, logApiError } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return jsonError("Unauthorized", 401);
    }

    const body = await request.json();
    const { exerciseId, correct, answer, timeSpent } = body;

    if (!exerciseId || typeof correct !== "boolean") {
      return jsonError("Missing required fields", 400);
    }

    const userId = Number(session.sub);
    if (!Number.isFinite(userId)) {
      return jsonError("Invalid session", 401);
    }

    const exercise = await prisma.exercise.findUnique({
      where: { id: Number(exerciseId) },
    });

    if (!exercise) {
      return jsonError("Exercise not found", 404);
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return jsonError("User not found", 401);
    }

    // Calculate points based on correctness and difficulty
    const points = correct ? exercise.points : 0;

    // Save exercise result
    const result = await prisma.exerciseResult.create({
      data: {
        userId,
        exerciseId: Number(exerciseId),
        correct,
        answer: answer || null,
        timeSpent: timeSpent || null,
        points,
      },
    });

    // Update user stats
    await prisma.userStats.upsert({
      where: { userId },
      update: {
        totalAnswers: { increment: 1 },
        correctAnswers: correct ? { increment: 1 } : undefined,
        xp: { increment: points },
        updatedAt: new Date(),
      },
      create: {
        userId,
        totalAnswers: 1,
        correctAnswers: correct ? 1 : 0,
        xp: points,
        totalExercises: 0,
        totalFlashcards: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalStudyTime: 0,
        level: 1,
        weeklyGoal: 50,
        weeklyProgress: 0,
      },
    });

    return jsonOk({
      success: true as const,
      result,
      pointsEarned: points,
    });
  } catch (error) {
    logApiError("exercises/result", error);
    return internalError();
  }
}
