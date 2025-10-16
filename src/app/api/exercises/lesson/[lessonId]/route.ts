import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const { lessonId } = await params;

    const exercises = await prisma.exercise.findMany({
      where: {
        lessonId: parseInt(lessonId),
        isActive: true,
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ exercises });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercises" },
      { status: 500 }
    );
  }
}
