import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get("userId") || "1");

    // Get user stats
    const userStats = await prisma.userStats.findUnique({
      where: { userId },
    });

    // Get total lessons available
    const totalLessons = await prisma.lesson.count();

    // Get total flashcards available
    const totalFlashcards = await prisma.flashcard.count();

    // Get total exercises available
    const totalExercises = await prisma.exercise.count();

    // Get completed study sessions
    const completedSessions = await prisma.studySession.findMany({
      where: {
        userId,
        isCompleted: true,
      },
      include: {
        lesson: {
          include: {
            unit: true,
          },
        },
      },
      orderBy: {
        endTime: "desc",
      },
    });

    // Get exercise results for accuracy calculation
    const exerciseResults = await prisma.exerciseResult.findMany({
      where: { userId },
    });

    // Calculate lessons completed from study sessions (since lessonsCompleted might not be updated)
    const lessonsCompleted = completedSessions.length;
    const overallProgress =
      totalLessons > 0
        ? Math.round((lessonsCompleted / totalLessons) * 100)
        : 0;

    // Calculate vocabulary mastery based on exercise results (simplified)
    const vocabularyExercises = await prisma.exercise.count({
      where: {
        lesson: {
          type: "VOCABULARY",
        },
      },
    });
    const correctVocabularyAnswers = await prisma.exerciseResult.count({
      where: {
        userId,
        correct: true,
        exercise: {
          lesson: {
            type: "VOCABULARY",
          },
        },
      },
    });
    const vocabularyMastery =
      vocabularyExercises > 0
        ? Math.round((correctVocabularyAnswers / vocabularyExercises) * 100)
        : 0;

    // Calculate grammar understanding (lessons completed vs total)
    const grammarLessons = await prisma.lesson.count({
      where: { type: "GRAMMAR" },
    });
    const completedGrammarLessons = completedSessions.filter(
      (session) => session.lesson.type === "GRAMMAR"
    ).length;
    const grammarUnderstanding =
      grammarLessons > 0
        ? Math.round((completedGrammarLessons / grammarLessons) * 100)
        : 0;

    // Speaking practice removed - not implemented yet

    // Calculate average score
    const totalAnswers = exerciseResults.length;
    const correctAnswers = exerciseResults.filter(
      (result) => result.correct
    ).length;
    const averageScore =
      totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

    // Recent activity (last 5 sessions)
    const recentActivity = completedSessions.slice(0, 5).map((session) => ({
      id: session.id,
      type: "lesson",
      title: `Completed ${session.lesson.title}`,
      timestamp: session.endTime,
      xpEarned: session.xpEarned,
    }));

    // Add recent exercise completions as activity
    const recentExercises = await prisma.exerciseResult.findMany({
      where: { userId },
      include: {
        exercise: {
          include: {
            lesson: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    recentExercises.forEach((result) => {
      recentActivity.push({
        id: result.id,
        type: "exercise",
        title: `${result.correct ? "Completed" : "Attempted"} exercise in ${
          result.exercise.lesson.title
        }`,
        timestamp: result.createdAt,
        xpEarned: result.points,
      });
    });

    // Sort recent activity by timestamp
    recentActivity.sort((a, b) => {
      const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json({
      success: true,
      stats: {
        // Progress bars
        overallProgress,
        vocabularyMastery,
        grammarUnderstanding,

        // Statistics cards
        lessonsCompleted,
        flashcardsMastered: Math.round(
          (correctVocabularyAnswers / Math.max(totalFlashcards, 1)) *
            totalFlashcards
        ),
        averageScore,
        currentStreak: userStats?.currentStreak || 0,

        // Totals for context
        totalLessons,
        totalFlashcards,
        totalExercises,

        // User stats
        xp: userStats?.xp || 0,
        level: userStats?.level || 1,
        longestStreak: userStats?.longestStreak || 0,

        // Recent activity
        recentActivity: recentActivity.slice(0, 5),
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
