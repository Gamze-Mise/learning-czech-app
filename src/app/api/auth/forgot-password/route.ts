import { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { jsonOk, logApiError } from "@/lib/api-response";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const GENERIC_MESSAGE =
  "If an account exists for this email, we’ve sent password reset instructions.";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonOk({
        ok: true as const,
        message: GENERIC_MESSAGE,
      });
    }

    // Use raw select to avoid enum decode failures on full User rows.
    const users = await prisma.$queryRaw<
      Array<{ id: number; email: string; name: string | null; passwordHash: string | null }>
    >`SELECT "id", "email", "name", "passwordHash" FROM "users" WHERE "email" = ${email} LIMIT 1`;
    const user = users[0] ?? null;
    const passwordHash = user?.passwordHash ?? null;

    if (user && passwordHash) {
      const token = randomBytes(32).toString("hex");
      const passwordResetExpires = new Date(Date.now() + 1000 * 60 * 60); // 1h

      await prisma.$executeRaw`
        UPDATE "users"
        SET "passwordResetToken" = ${token},
            "passwordResetExpires" = ${passwordResetExpires}
        WHERE "id" = ${user.id}
      `;

      const resetUrl = `${APP_URL}/reset-password?token=${encodeURIComponent(token)}`;
      const emailResult = await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl,
      });

      if (
        process.env.NODE_ENV !== "production" &&
        (!emailResult.ok || !emailResult.delivered)
      ) {
        return jsonOk({
          ok: true as const,
          message: GENERIC_MESSAGE,
          devResetUrl: resetUrl,
        });
      }

      if (!emailResult.ok && process.env.NODE_ENV === "production") {
        logApiError(
          "auth/forgot-password email",
          new Error(emailResult.error ?? "send failed")
        );
        // Do not reveal delivery/backend state to clients.
        return jsonOk({
          ok: true as const,
          message: GENERIC_MESSAGE,
        });
      }
    }

    return jsonOk({
      ok: true as const,
      message: GENERIC_MESSAGE,
    });
  } catch (e) {
    logApiError("auth/forgot-password", e);
    // Keep response generic even on DB/runtime errors to avoid leaking account/system state.
    return jsonOk({
      ok: true as const,
      message: GENERIC_MESSAGE,
    });
  }
}
