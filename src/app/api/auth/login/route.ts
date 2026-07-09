import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import {
  internalError,
  jsonError,
  jsonOk,
  logApiError,
} from "@/lib/api-response";

export const dynamic = "force-dynamic";

function envConfigErrorResponse(): ReturnType<typeof internalError> | null {
  const secret = process.env.AUTH_SECRET?.trim();
  if (!secret || secret.length < 32) {
    console.error(
      "[auth/login] Set AUTH_SECRET (min 32 chars) in Vercel → Environment Variables for Production.",
    );
    return internalError();
  }
  const db = process.env.DATABASE_URL?.trim();
  if (!db) {
    console.error(
      "[auth/login] Set DATABASE_URL in Vercel (hosted Postgres, not localhost).",
    );
    return internalError();
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const configErr = envConfigErrorResponse();
    if (configErr) return configErr;

    let body: { email?: unknown; password?: unknown };
    try {
      body = (await request.json()) as { email?: unknown; password?: unknown };
    } catch {
      return jsonError("Invalid JSON body", 400);
    }

    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return jsonError("Email and password are required", 400);
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        emailVerified: true,
        role: true,
      },
    });

    if (!user || !user.passwordHash) {
      return jsonError("Invalid email or password", 401);
    }

    let valid = false;
    try {
      valid = await verifyPassword(password, user.passwordHash);
    } catch {
      console.error("[auth/login] password verify threw (corrupt hash?)");
      return jsonError("Invalid email or password", 401);
    }
    if (!valid) {
      return jsonError("Invalid email or password", 401);
    }

    if (!user.emailVerified) {
      return jsonError(
        "Please verify your email first. Check your inbox for the confirmation link.",
        403,
      );
    }

    const role = String(user.role);
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
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(`[auth/login] Prisma ${e.code}: ${e.message}`);
    } else if (e instanceof Prisma.PrismaClientInitializationError) {
      console.error(`[auth/login] Prisma init failed: ${e.message}`);
    } else if (e instanceof Error) {
      console.error(`[auth/login] ${e.name}: ${e.message}`);
    }
    logApiError("auth/login", e);
    return internalError();
  }
}
