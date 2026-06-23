import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { internalError, jsonError, jsonOk, logApiError } from "@/lib/api-response";
import { parseRouteId } from "@/lib/api/parse-id";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { session, response } = await requireAdminSession();
  if (!session) return response!;

  const { id } = await ctx.params;
  const parsed = parseRouteId(id);
  if ("error" in parsed) return jsonError(parsed.error, 400);
  const unitId = parsed.id;

  try {
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      include: {
        course: { select: { id: true, title: true } },
        lessons: { orderBy: { order: "asc" } },
      },
    });
    if (!unit) return jsonError("Not found", 404);
    return jsonOk({ unit });
  } catch (e) {
    logApiError("admin/units/[id] GET", e);
    return internalError();
  }
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const { session, response } = await requireAdminSession();
  if (!session) return response!;

  const { id } = await ctx.params;
  const parsed = parseRouteId(id);
  if ("error" in parsed) return jsonError(parsed.error, 400);
  const unitId = parsed.id;

  try {
    const body = await request.json();
    const data: Record<string, unknown> = {};

    if (body.title != null) data.title = String(body.title).trim();
    if (body.description !== undefined)
      data.description = body.description ? String(body.description).trim() : null;
    if (body.level != null) data.level = Number(body.level);
    if (body.isActive != null) data.isActive = Boolean(body.isActive);
    if (body.thumbnail !== undefined)
      data.thumbnail = body.thumbnail ? String(body.thumbnail).trim() : null;

    const unit = await prisma.unit.update({ where: { id: unitId }, data });
    return jsonOk({ unit });
  } catch (e) {
    logApiError("admin/units/[id] PATCH", e);
    return internalError();
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { session, response } = await requireAdminSession();
  if (!session) return response!;

  const { id } = await ctx.params;
  const parsed = parseRouteId(id);
  if ("error" in parsed) return jsonError(parsed.error, 400);
  const unitId = parsed.id;

  try {
    await prisma.unit.update({ where: { id: unitId }, data: { isActive: false } });
    return jsonOk({ ok: true as const });
  } catch (e) {
    logApiError("admin/units/[id] DELETE", e);
    return internalError();
  }
}

