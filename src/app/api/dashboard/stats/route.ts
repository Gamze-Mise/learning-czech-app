import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get("userId") || "1");

    // Use Promise.all to run queries in parallel for better performance
    const [
      userStats,
      totalCounts,
      completedSessions,
      exerciseResults,
      recentExercises,
    ] = await Promise.all([
      // Get user stats
      prisma.userStats.findUnique({
        where: { userId },
      }),

      // Get all totals in one aggregation query
      prisma.$transaction([
        prisma.lesson.count({ where: { isActive: true } }),
        prisma.flashcard.count({ where: { isActive: true } }),
        prisma.exercise.count({ where: { isActive: true } }),
        prisma.lesson.count({ where: { type: "VOCABULARY", isActive: true } }),
        prisma.lesson.count({ where: { type: "GRAMMAR", isActive: true } }),
      ]),

      // Get completed study sessions (limit to recent ones for performance)
      prisma.studySession.findMany({
        where: {
          userId,
          isCompleted: true,
        },
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              type: true,
              unit: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
        orderBy: {
          endTime: "desc",
        },
        take: 50, // Limit for performance
      }),

      // Get exercise results with aggregation
      prisma.exerciseResult.groupBy({
        by: ["correct"],
        where: { userId },
        _count: {
          correct: true,
        },
      }),

      // Get recent exercises for activity
      prisma.exerciseResult.findMany({
        where: { userId },
        include: {
          exercise: {
            select: {
              id: true,
              lesson: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

    const [
      totalLessons,
      totalFlashcards,
      totalExercises,
      vocabularyLessons,
      grammarLessons,
    ] = totalCounts;

    // Calculate stats from aggregated data
    const lessonsCompleted = completedSessions.length;
    const overallProgress =
      totalLessons > 0
        ? Math.round((lessonsCompleted / totalLessons) * 100)
        : 0;

    // Calculate accuracy from grouped results
    const totalAnswers = exerciseResults.reduce(
      (sum, group) => sum + group._count.correct,
      0
    );
    const correctAnswers =
      exerciseResults.find((group) => group.correct)?._count.correct || 0;
    const averageScore =
      totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

    // Calculate lesson type completion
    const completedVocabularyLessons = completedSessions.filter(
      (session) => session.lesson.type === "VOCABULARY"
    ).length;
    const completedGrammarLessons = completedSessions.filter(
      (session) => session.lesson.type === "GRAMMAR"
    ).length;

    const vocabularyMastery =
      vocabularyLessons > 0
        ? Math.round((completedVocabularyLessons / vocabularyLessons) * 100)
        : 0;
    const grammarUnderstanding =
      grammarLessons > 0
        ? Math.round((completedGrammarLessons / grammarLessons) * 100)
        : 0;

    // Build recent activity efficiently
    const recentActivity = [
      ...completedSessions.slice(0, 5).map((session) => ({
        id: session.id,
        type: "lesson" as const,
        title: `Completed ${session.lesson.title}`,
        timestamp: session.endTime,
        xpEarned: session.xpEarned,
      })),
      ...recentExercises.map((result) => ({
        id: result.id,
        type: "exercise" as const,
        title: `${result.correct ? "Completed" : "Attempted"} exercise in ${
          result.exercise.lesson.title
        }`,
        timestamp: result.createdAt,
        xpEarned: result.points,
      })),
    ]
      .sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5);

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
          (correctAnswers / Math.max(totalFlashcards, 1)) * 100
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
        recentActivity,
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
