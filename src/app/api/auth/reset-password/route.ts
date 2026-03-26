import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { internalError, jsonError, jsonOk, logApiError } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = String(body.token ?? "").trim();
    const password = String(body.password ?? "");

    if (!token) {
      return jsonError("Reset link is invalid or expired.", 400);
    }
    if (password.length < 8) {
      return jsonError("Password must be at least 8 characters.", 400);
    }

    const users = await prisma.$queryRaw<
      Array<{ id: number }>
    >`SELECT "id" FROM "users"
       WHERE "passwordResetToken" = ${token}
         AND "passwordResetExpires" > ${new Date()}
       LIMIT 1`;
    const user = users[0] ?? null;

    if (!user) {
      return jsonError("Reset link is invalid or expired.", 400);
    }

    const passwordHash = await hashPassword(password);

    await prisma.$executeRaw`
      UPDATE "users"
      SET "passwordHash" = ${passwordHash},
          "passwordResetToken" = NULL,
          "passwordResetExpires" = NULL
      WHERE "id" = ${user.id}
    `;

    return jsonOk({
      ok: true as const,
      message: "Your password has been updated. You can sign in now.",
    });
  } catch (e) {
    logApiError("auth/reset-password", e);
    return internalError();
  }
}
