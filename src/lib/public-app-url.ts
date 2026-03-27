import type { NextRequest } from "next/server";

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

export function getPublicAppUrl(request: NextRequest): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const isLocalEnv =
    !envUrl ||
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/i.test(envUrl);

  if (envUrl && !isLocalEnv) {
    return stripTrailingSlash(envUrl);
  }

  const hostHeader =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host");
  if (hostHeader && !/^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(hostHeader)) {
    const proto =
      request.headers
        .get("x-forwarded-proto")
        ?.split(",")[0]
        ?.trim() || "https";
    return stripTrailingSlash(`${proto}://${hostHeader}`);
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const base = /^https?:\/\//i.test(vercel) ? vercel : `https://${vercel}`;
    return stripTrailingSlash(base);
  }

  return stripTrailingSlash(envUrl || "http://localhost:3000");
}
