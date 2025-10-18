import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, exerciseId, correct, answer, timeSpent } = body;

    if (!userId || !exerciseId || typeof correct !== "boolean") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get exercise to calculate points
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    // Calculate points based on correctness and difficulty
    const points = correct ? exercise.points : 0;

    // Save exercise result
    const result = await prisma.exerciseResult.create({
      data: {
        userId: parseInt(userId),
        exerciseId: parseInt(exerciseId),
        correct,
        answer: answer || null,
        timeSpent: timeSpent || null,
        points,
      },
    });

    // Update user stats
    await prisma.userStats.upsert({
      where: { userId: parseInt(userId) },
      update: {
        totalAnswers: { increment: 1 },
        correctAnswers: correct ? { increment: 1 } : undefined,
        xp: { increment: points },
        updatedAt: new Date(),
      },
      create: {
        userId: parseInt(userId),
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

    return NextResponse.json({
      success: true,
      result,
      pointsEarned: points,
    });
  } catch (error) {
    console.error("Error saving exercise result:", error);
    return NextResponse.json(
      { error: "Failed to save result" },
      { status: 500 }
    );
  }
}
