import { jsonError } from "@/lib/api-response";
import { getSessionFromCookies } from "./session";

export async function requireAdminSession() {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "ADMIN") {
    return {
      session: null as null,
      response: jsonError("Forbidden", 403),
    };
  }
  return { session, response: null as null };
}
