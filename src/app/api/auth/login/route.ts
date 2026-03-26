import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { internalError, jsonError, jsonOk, logApiError } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return jsonError("Email and password are required", 400);
    }

    const users = await prisma.$queryRaw<
      Array<{
        id: number;
        email: string;
        name: string | null;
        passwordHash: string | null;
        emailVerified: Date | null;
        role: string | null;
      }>
    >`SELECT "id", "email", "name", "passwordHash", "emailVerified", "role"
       FROM "users"
       WHERE "email" = ${email}
       LIMIT 1`;
    const user = users[0] ?? null;

    if (!user || !user.passwordHash) {
      return jsonError("Invalid email or password", 401);
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return jsonError("Invalid email or password", 401);
    }

    if (!user.emailVerified) {
      return jsonError(
        "Please verify your email first. Check your inbox for the confirmation link.",
        403
      );
    }

    const role = user.role ?? "USER";
    const token = await createSessionToken({
      sub: String(user.id),
      email: user.email,
      role,
    });
    await setSessionCookie(token);

    return jsonOk({
      ok: true as const,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role,
      },
    });
  } catch (e) {
    logApiError("auth/login", e);
    return internalError();
  }
}
