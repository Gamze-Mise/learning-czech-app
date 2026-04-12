import { NextRequest } from "next/server";
import { LessonType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { internalError, jsonError, jsonOk, logApiError } from "@/lib/api-response";

const TITLE_MAX = 200;
const THUMB_MAX = 2000;
const ALLOWED_TYPES = new Set<string>(Object.values(LessonType));

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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return jsonError("Request body must be a JSON object", 400);
  }

  const b = body as Record<string, unknown>;

  const unitId = Number(b.unitId);
  const title = String(b.title ?? "").trim();
  const description =
    b.description != null && String(b.description).trim()
      ? String(b.description).trim()
      : null;

  const rawType = b.type != null ? String(b.type) : "VOCABULARY";
  if (!ALLOWED_TYPES.has(rawType)) {
    return jsonError(
      `Invalid lesson type. Allowed: ${[...ALLOWED_TYPES].join(", ")}`,
      400
    );
  }
  const type = rawType as LessonType;

  let difficulty = Number(b.difficulty ?? 1);
  if (!Number.isFinite(difficulty)) {
    return jsonError("Difficulty must be a number", 400);
  }
  difficulty = Math.round(difficulty);
  if (difficulty < 1 || difficulty > 5) {
    return jsonError("Difficulty must be between 1 and 5", 400);
  }

  let estimatedTime: number | null = null;
  if (b.estimatedTime != null && String(b.estimatedTime).trim() !== "") {
    const et = Number(b.estimatedTime);
    if (!Number.isFinite(et) || et < 0 || !Number.isInteger(et)) {
      return jsonError(
        "Estimated time must be a whole number of minutes (0 or greater)",
        400
      );
    }
    estimatedTime = et;
  }

  const isActive = b.isActive !== false;
  const thumbnail =
    b.thumbnail != null && String(b.thumbnail).trim()
      ? String(b.thumbnail).trim()
      : null;

  if (!Number.isInteger(unitId) || unitId < 1) {
    return jsonError("Select a valid unit", 400);
  }
  if (!title) {
    return jsonError("Title is required", 400);
  }
  if (title.length > TITLE_MAX) {
    return jsonError(`Title is too long (max ${TITLE_MAX} characters)`, 400);
  }
  if (thumbnail && thumbnail.length > THUMB_MAX) {
    return jsonError(`Thumbnail URL is too long (max ${THUMB_MAX} characters)`, 400);
  }

  try {
    const unit = await prisma.unit.findUnique({ where: { id: unitId } });
    if (!unit) {
      return jsonError("Unit not found", 404);
    }

    const last = await prisma.lesson.findFirst({
      where: { unitId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const order = (last?.order ?? 0) + 1;

    const lesson = await prisma.lesson.create({
      data: {
        unitId,
        title,
        order,
        description,
        type,
        difficulty,
        estimatedTime,
        isActive,
        thumbnail,
      },
    });

    return jsonOk({ lesson });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2003") {
        return jsonError("Unit not found or was removed", 404);
      }
      if (e.code === "P2002") {
        return jsonError("Could not create lesson due to a conflict. Try again.", 409);
      }
    }
    if (e instanceof Prisma.PrismaClientValidationError) {
      return jsonError(
        "Lesson data does not match the database (e.g. lesson type). Run migrations or fix fields.",
        400
      );
    }
    logApiError("admin/lessons POST", e);
    return internalError();
  }
}
