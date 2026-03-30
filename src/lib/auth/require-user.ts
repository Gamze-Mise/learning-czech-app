import { jsonError } from "@/lib/api-response";
import { getSessionFromCookies } from "./session";

export async function requireUserSession() {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "USER") {
    return {
      session: null as null,
      response: jsonError("Unauthorized", 401),
    };
  }
  return { session, response: null as null };
}

