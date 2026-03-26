import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { internalError, jsonError, jsonOk, logApiError } from "@/lib/api-response";

export async function GET() {
  const { session, response } = await requireAdminSession();
  if (!session) return response!;

  try {
    const courses = await prisma.courses.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { units: true } } },
    });
    return jsonOk({ courses });
  } catch (e) {
    logApiError("admin/courses GET", e);
    return internalError();
  }
}

export async function POST(request: NextRequest) {
  const { session, response } = await requireAdminSession();
  if (!session) return response!;

  try {
    const body = await request.json();
    const title = String(body.title ?? "").trim();
    const description =
      body.description != null && String(body.description).trim()
        ? String(body.description).trim()
        : null;
    const order = Number(body.order ?? 0);
    const level = Number(body.level ?? 1);
    const isActive = body.isActive !== false;
    const thumbnail =
      body.thumbnail != null && String(body.thumbnail).trim()
        ? String(body.thumbnail).trim()
        : null;

    if (!title) return jsonError("title is required", 400);

    const course = await prisma.courses.create({
      data: { title, description, order, level, isActive, thumbnail },
    });
    return jsonOk({ course });
  } catch (e) {
    logApiError("admin/courses POST", e);
    return internalError();
  }
}

