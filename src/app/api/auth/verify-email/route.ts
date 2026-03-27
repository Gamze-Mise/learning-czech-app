import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logApiError } from "@/lib/api-response";
import { getPublicAppUrl } from "@/lib/public-app-url";

export async function GET(request: NextRequest) {
  const appUrl = getPublicAppUrl(request);
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(
      new URL("/register?error=missing_token", appUrl)
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
        new URL("/register?error=invalid_token", appUrl)
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

    return NextResponse.redirect(new URL("/login?verified=1", appUrl));
  } catch (error) {
    logApiError("auth/verify-email", error);
    return NextResponse.redirect(
      new URL("/register?error=verification_failed", appUrl)
    );
  }
}
