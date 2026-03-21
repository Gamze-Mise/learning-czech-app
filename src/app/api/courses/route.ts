import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { internalError, jsonOk, logApiError } from "@/lib/api-response";

export async function GET(_request: NextRequest) {
  try {
    const courses = await prisma.courses.findMany({
      include: {
        units: {
          include: {
            lessons: {
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    return jsonOk({ success: true as const, courses });
  } catch (error) {
    logApiError("courses", error);
    return internalError();
  }
}
