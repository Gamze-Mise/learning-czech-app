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

    const pointsEarned = correct ? exercise.points : 0;

    // Create exercise result
    const result = await prisma.exerciseResult.create({
      data: {
        userId,
        exerciseId,
        correct,
        answer,
        timeSpent,
        points: pointsEarned,
      },
    });

    // Update user XP
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalXP: {
          increment: pointsEarned,
        },
      },
    });

    return NextResponse.json({
      success: true,
      result,
      pointsEarned,
    });
  } catch (error) {
    console.error("Error saving exercise result:", error);
    return NextResponse.json(
      { error: "Failed to save result" },
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
      whereClause.exercise = {
        lessonId: lessonId,
      };
    }

    const results = await prisma.exerciseResult.findMany({
      where: whereClause,
      include: {
        exercise: {
          include: {
            lesson: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error fetching exercise results:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}
