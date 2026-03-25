import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromCookies } from "@/lib/auth/session";
import { internalError, jsonError, jsonOk, logApiError } from "@/lib/api-response";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await context.params;
    const session = await getSessionFromCookies();
    if (!session) {
      return jsonError("Unauthorized", 401);
    }
    const userId = Number(session.sub);
    if (!Number.isFinite(userId)) {
      return jsonError("Invalid session", 401);
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
      return jsonError("Lesson not found", 404);
    }

    // Check if study session already exists
    const existingSession = await prisma.studySession.findFirst({
      where: {
        userId,
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
          userId,
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
      where: { userId },
      update: {
        xp: { increment: 50 },
        currentStreak: { increment: 1 },
        longestStreak: { increment: 1 },
        lastStudyDate: new Date(),
        updatedAt: new Date(),
      },
      create: {
        userId,
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

    return jsonOk({
      success: true as const,
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
    logApiError("lessons/[lessonId]/complete", error);
    return internalError();
  }
}
