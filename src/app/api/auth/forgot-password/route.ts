import { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { internalError, jsonOk, logApiError } from "@/lib/api-response";

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

    // Full row: avoids UserSelect typing issues when CI runs before prisma generate.
    // passwordHash read via narrow type so builds match schema even if client is stale.
    const user = await prisma.user.findUnique({ where: { email } });
    const passwordHash = user
      ? (user as { passwordHash?: string | null }).passwordHash
      : null;

    if (user && passwordHash) {
      const token = randomBytes(32).toString("hex");
      const passwordResetExpires = new Date(Date.now() + 1000 * 60 * 60); // 1h

      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: token,
          passwordResetExpires,
        },
      });

      const resetUrl = `${APP_URL}/reset-password?token=${encodeURIComponent(token)}`;
      const emailResult = await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl,
      });

      if (!emailResult.ok && process.env.NODE_ENV === "production") {
        logApiError(
          "auth/forgot-password email",
          new Error(emailResult.error ?? "send failed")
        );
        return internalError();
      }
    }

    return jsonOk({
      ok: true as const,
      message: GENERIC_MESSAGE,
    });
  } catch (e) {
    logApiError("auth/forgot-password", e);
    return internalError();
  }
}
