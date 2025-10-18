import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await context.params;

    const flashcards = await prisma.flashcard.findMany({
      where: {
        lessonId: parseInt(lessonId),
        isActive: true,
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    return NextResponse.json(
      { error: "Failed to fetch flashcards" },
      { status: 500 }
    );
  }
}
