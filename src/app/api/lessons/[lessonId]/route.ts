import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await context.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(lessonId) },
      include: {
        unit: {
          include: {
            course: true,
          },
        },
        parts: {
          orderBy: { order: "asc" },
        },
        flashcards: {
          orderBy: { order: "asc" },
        },
        exercises: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson" },
      { status: 500 }
    );
  }
}
