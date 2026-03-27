import { NextRequest } from "next/server";
import { internalError, jsonError, jsonOk, logApiError } from "@/lib/api-response";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { sendVerificationEmail } from "@/lib/email";
import { getPublicAppUrl } from "@/lib/public-app-url";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(body.password ?? "");
    const name = body.name ? String(body.name).trim() : null;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonError("Valid email is required", 400);
    }
    if (password.length < 8) {
      return jsonError("Password must be at least 8 characters", 400);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return jsonError("An account with this email already exists", 409);
    }

    const passwordHash = await hashPassword(password);
    const token = randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

    await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        verificationToken: token,
        verificationExpires,
        role: "USER",
      },
    });

    const appUrl = getPublicAppUrl(request);
    const verifyUrl = `${appUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`;
    const emailResult = await sendVerificationEmail({
      to: email,
      name,
      verifyUrl,
    });

    if (!emailResult.ok) {
      if (process.env.NODE_ENV === "production") {
        return jsonError(
          emailResult.error ??
            "Could not send verification email. Try again later.",
          500
        );
      }
      return jsonOk({
        ok: true as const,
        message:
          "Account created. Email could not be sent — use the link below to verify (development only).",
        devVerificationUrl: verifyUrl,
        emailError: emailResult.error,
      });
    }

    if (!emailResult.delivered) {
      return jsonOk({
        ok: true as const,
        message:
          "Account created. Add RESEND_API_KEY to receive mail — or open this link to verify (development only).",
        devVerificationUrl: verifyUrl,
      });
    }

    return jsonOk({
      ok: true as const,
      message:
        "Account created. Check your email to verify your address before signing in.",
    });
  } catch (e) {
    logApiError("auth/register", e);
    return internalError();
  }
}
