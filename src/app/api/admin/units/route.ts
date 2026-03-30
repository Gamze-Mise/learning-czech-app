import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { internalError, jsonError, jsonOk, logApiError } from "@/lib/api-response";

export async function GET() {
  const { session, response } = await requireAdminSession();
  if (!session) return response!;

  try {
    const units = await prisma.unit.findMany({
      orderBy: [{ courseId: "asc" }, { order: "asc" }],
      include: {
        course: { select: { id: true, title: true } },
        _count: { select: { lessons: true } },
      },
    });

    return jsonOk({ units });
  } catch (error) {
    logApiError("admin/units GET", error);
    return internalError();
  }
}

export async function POST(request: NextRequest) {
  const { session, response } = await requireAdminSession();
  if (!session) return response!;

  try {
    const body = await request.json();
    const courseId = body.courseId != null ? Number(body.courseId) : null;
    const title = String(body.title ?? "").trim();
    const description =
      body.description != null && String(body.description).trim()
        ? String(body.description).trim()
        : null;
    const order = Number(body.order ?? 1);
    const level = Number(body.level ?? 1);
    const isActive = body.isActive !== false;
    const thumbnail =
      body.thumbnail != null && String(body.thumbnail).trim()
        ? String(body.thumbnail).trim()
        : null;

    if (!title) return jsonError("title is required", 400);

    if (courseId != null) {
      const course = await prisma.courses.findUnique({ where: { id: courseId } });
      if (!course) return jsonError("Course not found", 404);
    }

    const unit = await prisma.unit.create({
      data: { courseId, title, description, order, level, isActive, thumbnail },
    });
    return jsonOk({ unit });
  } catch (e) {
    logApiError("admin/units POST", e);
    return internalError();
  }
}
