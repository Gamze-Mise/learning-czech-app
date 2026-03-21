import type { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { processFlashcardReview } from "@/lib/srs";
import {
  internalError,
  jsonError,
  jsonOk,
  logApiError,
} from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, flashcardId, result, studyTimeSeconds } = body;

    if (!userId || !flashcardId || !result) {
      return jsonError("Missing required fields", 400);
    }

    // Get current progress or create new one
    let progress = await prisma.flashcardProgress.findUnique({
      where: {
        userId_flashcardId: {
          userId,
          flashcardId,
        },
      },
    });

    if (!progress) {
      // Create new progress record
      progress = await prisma.flashcardProgress.create({
        data: {
          userId,
          flashcardId,
          box: 1,
          correctCount: 0,
          wrongCount: 0,
          streak: 0,
          totalTime: 0,
          lastStudyTime: studyTimeSeconds || 0,
        },
      });
    }

    // Process the review result
    const reviewResult = processFlashcardReview(
      progress.box,
      progress.correctCount,
      progress.wrongCount,
      progress.streak,
      result,
      studyTimeSeconds
    );

    // Update progress in database
    const updatedProgress = await prisma.flashcardProgress.update({
      where: {
        id: progress.id,
      },
      data: {
        box: reviewResult.newBox,
        correctCount: reviewResult.correctCount,
        wrongCount: reviewResult.wrongCount,
        streak: reviewResult.streak,
        nextDue: reviewResult.nextDue,
        lastSeen: new Date(),
        isMastered: reviewResult.isMastered,
        totalTime: progress.totalTime + (studyTimeSeconds || 0),
        lastStudyTime: studyTimeSeconds || 0,
      },
    });

    // Update user XP
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalXP: {
          increment: reviewResult.xpEarned,
        },
      },
    });

    return jsonOk({
      success: true as const,
      progress: updatedProgress,
      xpEarned: reviewResult.xpEarned,
    });
  } catch (error) {
    logApiError("flashcards/progress POST", error);
    return internalError();
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const lessonId = searchParams.get("lessonId");

    if (!userId) {
      return jsonError("User ID is required", 400);
    }

    const uid = parseInt(userId, 10);
    if (Number.isNaN(uid)) {
      return jsonError("Invalid user ID", 400);
    }

    const whereClause: Prisma.FlashcardProgressWhereInput = { userId: uid };

    if (lessonId) {
      const lessonIdNum = parseInt(lessonId, 10);
      if (!Number.isNaN(lessonIdNum)) {
        whereClause.flashcard = { lessonId: lessonIdNum };
      }
    }

    const progress = await prisma.flashcardProgress.findMany({
      where: whereClause,
      include: {
        flashcard: {
          include: {
            lesson: true,
          },
        },
      },
    });

    return jsonOk({ progress });
  } catch (error) {
    logApiError("flashcards/progress GET", error);
    return internalError();
  }
}
