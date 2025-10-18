import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "1"; // Default user

    // Get user's latest completed lesson
    const latestSession = await prisma.studySession.findFirst({
      where: {
        userId: parseInt(userId),
        isCompleted: true,
      },
      orderBy: {
        endTime: "desc",
      },
      include: {
        lesson: {
          include: {
            unit: {
              include: {
                course: true,
                lessons: {
                  orderBy: { order: "asc" },
                },
              },
            },
          },
        },
      },
    });

    // Get user stats first
    const userStats = await prisma.userStats.findUnique({
      where: { userId: parseInt(userId) },
    });

    if (!latestSession) {
      // No progress yet, return first lesson
      const firstLesson = await prisma.lesson.findFirst({
        orderBy: [{ unitId: "asc" }, { order: "asc" }],
        include: {
          unit: {
            include: {
              course: true,
            },
          },
        },
      });

      return NextResponse.json({
        hasProgress: false,
        nextLesson: firstLesson,
        message: "Start your Czech learning journey!",
        stats: {
          xp: userStats?.xp || 0,
          lessonsCompleted: 0, // Will be calculated from sessions
          currentStreak: userStats?.currentStreak || 0,
        },
        lastIncompleteLesson: firstLesson
          ? {
              id: firstLesson.id,
              title: firstLesson.title,
              unitId: firstLesson.unitId,
            }
          : null,
      });
    }

    // Find next lesson after the completed one
    const currentLesson = latestSession.lesson;
    const currentUnit = currentLesson.unit;
    const currentLessonIndex = currentUnit.lessons.findIndex(
      (l) => l.id === currentLesson.id
    );

    let nextLesson = null;
    let message = "";

    if (currentLessonIndex < currentUnit.lessons.length - 1) {
      // Next lesson in same unit
      nextLesson = currentUnit.lessons[currentLessonIndex + 1];
      message = `Continue with ${nextLesson.title}`;
    } else {
      // Find next unit's first lesson
      const nextUnit = await prisma.unit.findFirst({
        where: {
          courseId: currentUnit.courseId,
          order: { gt: currentUnit.order },
        },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            take: 1,
          },
          course: true,
        },
      });

      if (nextUnit && nextUnit.lessons.length > 0) {
        nextLesson = {
          ...nextUnit.lessons[0],
          unit: nextUnit,
        };
        message = `Start ${nextUnit.title}`;
      } else {
        message = "Congratulations! You've completed all available lessons!";
      }
    }

    // Calculate lessons completed from sessions
    const lessonsCompleted = await prisma.studySession.count({
      where: {
        userId: parseInt(userId),
        isCompleted: true,
      },
    });

    return NextResponse.json({
      hasProgress: true,
      lastCompletedLesson: {
        id: currentLesson.id,
        title: currentLesson.title,
        unit: {
          id: currentUnit.id,
          title: currentUnit.title,
        },
      },
      nextLesson,
      message,
      stats: {
        xp: userStats?.xp || 0,
        lessonsCompleted,
        currentStreak: userStats?.currentStreak || 0,
      },
      lastIncompleteLesson: nextLesson
        ? {
            id: nextLesson.id,
            title: nextLesson.title,
            unitId: nextLesson.unitId,
          }
        : null,
    });
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
