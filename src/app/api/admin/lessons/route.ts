import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { LessonType } from "@prisma/client";
import { internalError, jsonError, jsonOk, logApiError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  const { session, response } = await requireAdminSession();
  if (!session) return response!;

  try {
    const unitId = request.nextUrl.searchParams.get("unitId");
    const where = unitId ? { unitId: parseInt(unitId, 10) } : {};

    const lessons = await prisma.lesson.findMany({
      where,
      orderBy: [{ unitId: "asc" }, { order: "asc" }],
      include: {
        unit: {
          select: {
            id: true,
            title: true,
            course: { select: { title: true } },
          },
        },
        _count: {
          select: { exercises: true, flashcards: true, parts: true },
        },
      },
    });

    return jsonOk({ lessons });
  } catch (error) {
    logApiError("admin/lessons GET", error);
    return internalError();
  }
}

export async function POST(request: NextRequest) {
  const { session, response } = await requireAdminSession();
  if (!session) return response!;

  try {
    const body = await request.json();
    const unitId = Number(body.unitId);
    const title = String(body.title ?? "").trim();
    const order = Number(body.order ?? 1);
    const description = body.description
      ? String(body.description).trim()
      : null;
    const type = (body.type as LessonType) ?? "VOCABULARY";
    const difficulty = Number(body.difficulty ?? 1);
    const estimatedTime =
      body.estimatedTime != null ? Number(body.estimatedTime) : null;
    const isActive = body.isActive !== false;

    if (!unitId || !title) {
      return jsonError("unitId and title are required", 400);
    }

    const unit = await prisma.unit.findUnique({ where: { id: unitId } });
    if (!unit) {
      return jsonError("Unit not found", 404);
    }

    const lesson = await prisma.lesson.create({
      data: {
        unitId,
        title,
        order,
        description,
        type,
        difficulty,
        estimatedTime: Number.isFinite(estimatedTime) ? estimatedTime : null,
        isActive,
      },
    });

    return jsonOk({ lesson });
  } catch (e) {
    logApiError("admin/lessons POST", e);
    return internalError();
  }
}
