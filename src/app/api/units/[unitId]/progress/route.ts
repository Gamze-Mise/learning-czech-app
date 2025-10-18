import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ unitId: string }> }
) {
  try {
    const { unitId } = await context.params;
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get("userId") || "1");

    // Get unit with lessons
    const unit = await prisma.unit.findUnique({
      where: { id: parseInt(unitId) },
      include: {
        lessons: {
          include: {
            exercises: true,
            flashcards: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!unit) {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    // Get user's completed study sessions for this unit
    const completedSessions = await prisma.studySession.findMany({
      where: {
        userId,
        isCompleted: true,
        lesson: {
          unitId: parseInt(unitId),
        },
      },
      include: {
        lesson: true,
      },
    });

    // Get user's exercise results for this unit
    const exerciseResults = await prisma.exerciseResult.findMany({
      where: {
        userId,
        exercise: {
          lesson: {
            unitId: parseInt(unitId),
          },
        },
      },
      include: {
        exercise: {
          include: {
            lesson: true,
          },
        },
      },
    });

    // Calculate progress for each lesson
    const lessonsWithProgress = unit.lessons.map((lesson) => {
      // Check if lesson is completed
      const isCompleted = completedSessions.some(
        (session) => session.lessonId === lesson.id
      );

      // Calculate exercise completion rate
      const lessonExercises = lesson.exercises;
      const completedExercises = exerciseResults.filter(
        (result) => result.exercise.lessonId === lesson.id
      );

      let exerciseProgress = 0;
      if (lessonExercises.length > 0) {
        exerciseProgress = Math.round(
          (completedExercises.length / lessonExercises.length) * 100
        );
      }

      // Calculate overall lesson progress
      let overallProgress = 0;
      if (isCompleted) {
        overallProgress = 100;
      } else if (exerciseProgress > 0) {
        // If some exercises are done but lesson not completed, show partial progress
        overallProgress = Math.min(exerciseProgress, 90); // Max 90% until lesson is completed
      }

      return {
        ...lesson,
        progress: overallProgress,
        isCompleted,
        exerciseProgress,
        completedExercises: completedExercises.length,
        totalExercises: lessonExercises.length,
      };
    });

    // Calculate unit overall progress
    const totalLessons = unit.lessons.length;
    const completedLessons = completedSessions.length;
    const unitProgress =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    return NextResponse.json({
      success: true,
      unit: {
        ...unit,
        lessons: lessonsWithProgress,
        progress: unitProgress,
        completedLessons,
        totalLessons,
      },
    });
  } catch (error) {
    console.error("Error fetching unit progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch unit progress" },
      { status: 500 }
    );
  }
}
