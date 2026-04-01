import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
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

  let parsed: any = null;
  try {
    const body = await request.json();
    parsed = body;
    const title = String(body.title ?? "").trim();
    const description =
      body.description != null && String(body.description).trim()
        ? String(body.description).trim()
        : null;
    const level = Number(body.level ?? 1);
    const isActive = body.isActive !== false;
    const thumbnail =
      body.thumbnail != null && String(body.thumbnail).trim()
        ? String(body.thumbnail).trim()
        : null;

    if (!title) return jsonError("title is required", 400);

    // Order is assigned automatically (append).
    const last = await prisma.unit.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const order = (last?.order ?? 0) + 1;

    const unit = await prisma.unit.create({
      data: {
        title,
        description,
        order,
        level,
        isActive,
        thumbnail,
      },
    });
    return jsonOk({ unit });
  } catch (e) {
    // If the DB sequence for units.id is out of sync (e.g. after manual inserts),
    // Postgres can try to reuse an existing id and trip a unique constraint.
    // Reset the sequence and retry once.
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002" &&
      Array.isArray((e.meta as any)?.target) &&
      ((e.meta as any).target as string[]).includes("id")
    ) {
      try {
        await prisma.$executeRaw`
          SELECT setval(
            pg_get_serial_sequence('units', 'id'),
            (SELECT COALESCE(MAX(id), 0) FROM units)
          )
        `;
        const title = String(parsed?.title ?? "").trim();
        const description =
          parsed?.description != null && String(parsed.description).trim()
            ? String(parsed.description).trim()
            : null;
        const level = Number(parsed?.level ?? 1);
        const isActive = parsed?.isActive !== false;
        const thumbnail =
          parsed?.thumbnail != null && String(parsed.thumbnail).trim()
            ? String(parsed.thumbnail).trim()
            : null;
        if (!title) return jsonError("title is required", 400);
        const last = await prisma.unit.findFirst({
          orderBy: { order: "desc" },
          select: { order: true },
        });
        const order = (last?.order ?? 0) + 1;
        const unit = await prisma.unit.create({
          data: { title, description, order, level, isActive, thumbnail },
        });
        return jsonOk({ unit });
      } catch (retryErr) {
        logApiError("admin/units POST retry", retryErr);
        return internalError();
      }
    }
    logApiError("admin/units POST", e);
    return internalError();
  }
}
