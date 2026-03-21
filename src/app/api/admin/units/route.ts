import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { internalError, jsonOk, logApiError } from "@/lib/api-response";

export async function GET() {
  const { session, response } = await requireAdminSession();
  if (!session) return response!;

  try {
    const units = await prisma.unit.findMany({
      where: { isActive: true },
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
