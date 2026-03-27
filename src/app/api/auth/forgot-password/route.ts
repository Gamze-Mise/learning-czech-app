import { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { jsonOk, logApiError } from "@/lib/api-response";
import { getPublicAppUrl } from "@/lib/public-app-url";

const GENERIC_MESSAGE =
  "If an account exists for this email, we’ve sent password reset instructions.";

export const dynamic = "force-dynamic";

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

    const bodyIntent =
      String(body?.intent ?? "")
        .trim()
        .toLowerCase() === "admin";
    const headerIntent =
      request.headers.get("x-password-reset-intent")?.trim().toLowerCase() ===
      "admin";
    const intent = bodyIntent || headerIntent ? "admin" : "user";

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        role: true,
      },
    });
    const passwordHash = user?.passwordHash ?? null;

    if (!user || !passwordHash) {
      return jsonOk({
        ok: true as const,
        message: GENERIC_MESSAGE,
      });
    }

    const isSuperAdmin =
      String(user.role).replace(/["']/g, "").trim().toUpperCase() ===
      "SUPER_ADMIN";

    const allowedForIntent =
      (intent === "admin" && isSuperAdmin) ||
      (intent === "user" && !isSuperAdmin);

    if (!allowedForIntent) {
      return jsonOk({
        ok: true as const,
        message: GENERIC_MESSAGE,
      });
    }

    {
      const token = randomBytes(32).toString("hex");
      const passwordResetExpires = new Date(Date.now() + 1000 * 60 * 60); // 1h

      await prisma.$executeRaw`
        UPDATE "users"
        SET "passwordResetToken" = ${token},
            "passwordResetExpires" = ${passwordResetExpires}
        WHERE "id" = ${user.id}
      `;

      const appUrl = getPublicAppUrl(request);
      const resetBase = `${appUrl}/reset-password?token=${encodeURIComponent(token)}`;
      const resetUrl =
        intent === "admin"
          ? `${resetBase}&intent=admin`
          : resetBase;
      const emailResult = await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl,
      });

      if (!emailResult.ok) {
        await prisma.$executeRaw`
          UPDATE "users"
          SET "passwordResetToken" = NULL,
              "passwordResetExpires" = NULL
          WHERE "id" = ${user.id}
        `;
        logApiError(
          "auth/forgot-password email",
          new Error(emailResult.error ?? "send failed")
        );
      }
    }

    return jsonOk({
      ok: true as const,
      message: GENERIC_MESSAGE,
    });
  } catch (e) {
    logApiError("auth/forgot-password", e);
    return jsonOk({
      ok: true as const,
      message: GENERIC_MESSAGE,
    });
  }
}
