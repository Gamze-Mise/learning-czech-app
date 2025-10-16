import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { exerciseId: string } }
) {
  try {
    const { exerciseId } = await params;

    const exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(exerciseId) },
    });

    if (!exercise) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    // Handle JSON fields - Prisma already parses JSON fields
    const parsedExercise = {
      ...exercise,
      options: exercise.options || [],
      answer: exercise.answer || "",
      explanation: exercise.explanation || "",
    };

    return NextResponse.json(parsedExercise);
  } catch (error) {
    console.error("Error fetching exercise:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
