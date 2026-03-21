import { prisma } from "@/lib/prisma";
import { getSessionFromCookies } from "@/lib/auth/session";
import { internalError, jsonOk, logApiError } from "@/lib/api-response";

export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return jsonOk({ user: null }, 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(session.sub) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return jsonOk({ user: null }, 401);
    }

    return jsonOk({ user });
  } catch (e) {
    logApiError("auth/me", e);
    return internalError();
  }
}
