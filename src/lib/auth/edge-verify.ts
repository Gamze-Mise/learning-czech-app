import { jwtVerify } from "jose";
import type { SessionPayload } from "./session";

/**
 * JWT verification for Edge runtime (middleware). Keep in sync with session.ts payload.
 */
export async function verifyTokenEdge(
  token: string
): Promise<SessionPayload | null> {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) return null;
  const key = new TextEncoder().encode(secret);
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    const sub = payload.sub as string | undefined;
    const email = payload.email as string | undefined;
    const role = payload.role as string | undefined;
    if (!sub || !email || !role) return null;
    return { sub, email, role };
  } catch {
    return null;
  }
}
