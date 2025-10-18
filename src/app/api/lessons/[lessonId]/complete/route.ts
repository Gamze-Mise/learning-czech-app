import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await context.params;
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(lessonId) },
      include: {
        unit: {
          include: {
            lessons: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Check if study session already exists
    const existingSession = await prisma.studySession.findFirst({
      where: {
        userId: parseInt(userId),
        lessonId: parseInt(lessonId),
      },
    });

    let studySession;
    if (existingSession) {
      // Update existing session
      studySession = await prisma.studySession.update({
        where: { id: existingSession.id },
        data: {
          isCompleted: true,
          endTime: new Date(),
          xpEarned: 50,
        },
      });
    } else {
      // Create new session
      studySession = await prisma.studySession.create({
        data: {
          userId: parseInt(userId),
          lessonId: parseInt(lessonId),
          startTime: new Date(),
          endTime: new Date(),
          isCompleted: true,
          xpEarned: 50,
        },
      });
    }

    // Find next lesson in the same unit
    const currentLessonIndex = lesson.unit.lessons.findIndex(
      (l) => l.id === lesson.id
    );
    const nextLesson = lesson.unit.lessons[currentLessonIndex + 1];

    // Update user stats (removed lessonsCompleted as it's calculated from StudySession)
    await prisma.userStats.upsert({
      where: { userId: parseInt(userId) },
      update: {
        xp: { increment: 50 },
        currentStreak: { increment: 1 },
        longestStreak: { increment: 1 },
        lastStudyDate: new Date(),
        updatedAt: new Date(),
      },
      create: {
        userId: parseInt(userId),
        xp: 50,
        totalExercises: 0,
        totalFlashcards: 0,
        correctAnswers: 0,
        totalAnswers: 0,
        currentStreak: 1,
        longestStreak: 1,
        totalStudyTime: 0,
        level: 1,
        weeklyGoal: 50,
        weeklyProgress: 1,
        lastStudyDate: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Lesson completed successfully!",
      xpEarned: 50,
      nextLesson: nextLesson
        ? {
            id: nextLesson.id,
            title: nextLesson.title,
            unitId: lesson.unit.id,
          }
        : null,
      studySession,
    });
  } catch (error) {
    console.error("Error completing lesson:", error);
    return NextResponse.json(
      { error: "Failed to complete lesson" },
      { status: 500 }
    );
  }
}
