import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    // Get user stats
    const userStats = await prisma.userStats.findUnique({
      where: { userId: parseInt(userId) },
    });

    if (!userStats) {
      return NextResponse.json(
        { error: "User stats not found" },
        { status: 404 }
      );
    }

    // Get recent study sessions
    const recentSessions = await prisma.studySession.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { startTime: "desc" },
      take: 10,
      include: {
        lesson: {
          include: {
            unit: true,
          },
        },
      },
    });

    // Get flashcard progress summary
    const flashcardProgress = await prisma.flashcardProgress.findMany({
      where: { userId: parseInt(userId) },
      include: {
        flashcard: {
          include: {
            lesson: true,
          },
        },
      },
    });

    const masteredCards = flashcardProgress.filter((p) => p.box >= 5).length;
    const totalCards = flashcardProgress.length;
    const dueCards = flashcardProgress.filter(
      (p) => p.box < 5 && (p.nextDue === null || p.nextDue <= new Date())
    ).length;

    // Get exercise results summary
    const exerciseResults = await prisma.exerciseResult.findMany({
      where: { userId: parseInt(userId) },
    });

    const totalExercises = exerciseResults.length;
    const correctExercises = exerciseResults.filter((r) => r.correct).length;
    const accuracy =
      totalExercises > 0 ? (correctExercises / totalExercises) * 100 : 0;

    return NextResponse.json({
      userStats,
      recentSessions,
      flashcardSummary: {
        total: totalCards,
        mastered: masteredCards,
        due: dueCards,
        masteryRate: totalCards > 0 ? (masteredCards / totalCards) * 100 : 0,
      },
      exerciseSummary: {
        total: totalExercises,
        correct: correctExercises,
        accuracy: Math.round(accuracy),
      },
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const body = await request.json();

    const updatedStats = await prisma.userStats.update({
      where: { userId: parseInt(userId) },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, stats: updatedStats });
  } catch (error) {
    console.error("Error updating user stats:", error);
    return NextResponse.json(
      { error: "Failed to update user stats" },
      { status: 500 }
    );
  }
}
