import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logApiError } from "@/lib/api-response";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(
      new URL("/register?error=missing_token", APP_URL)
    );
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationExpires: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.redirect(
        new URL("/register?error=invalid_token", APP_URL)
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationExpires: null,
      },
    });

    return NextResponse.redirect(new URL("/login?verified=1", APP_URL));
  } catch (error) {
    logApiError("auth/verify-email", error);
    return NextResponse.redirect(
      new URL("/register?error=verification_failed", APP_URL)
    );
  }
}
