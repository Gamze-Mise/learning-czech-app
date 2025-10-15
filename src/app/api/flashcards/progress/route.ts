import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processFlashcardReview } from "@/lib/srs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, flashcardId, result, studyTimeSeconds } = body;

    if (!userId || !flashcardId || !result) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
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

    return NextResponse.json({
      success: true,
      progress: updatedProgress,
      xpEarned: reviewResult.xpEarned,
    });
  } catch (error) {
    console.error("Error updating flashcard progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const lessonId = searchParams.get("lessonId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    let whereClause: any = { userId };

    if (lessonId) {
      whereClause.flashcard = {
        lessonId: lessonId,
      };
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

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Error fetching flashcard progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
