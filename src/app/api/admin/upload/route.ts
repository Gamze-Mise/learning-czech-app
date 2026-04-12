import { NextRequest } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { jsonError, jsonOk, logApiError } from "@/lib/api-response";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const extByMime: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(request: NextRequest) {
  const { session, response } = await requireAdminSession();
  if (!session) return response!;

  try {
    const form = await request.formData();
    const entry = form.get("file");
    if (!(entry instanceof Blob)) {
      return jsonError("Missing file", 400);
    }

    const mime = entry.type || "application/octet-stream";
    if (!ALLOWED.has(mime)) {
      return jsonError("Only JPEG, PNG, WebP, or GIF images are allowed", 400);
    }
    if (entry.size > MAX_BYTES) {
      return jsonError("Image must be 5MB or smaller", 400);
    }

    const buffer = Buffer.from(await entry.arrayBuffer());
    const ext = extByMime[mime] ?? "bin";
    const name = `${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads", "admin");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), buffer);

    const url = `/uploads/admin/${name}`;
    return jsonOk({ url });
  } catch (error) {
    logApiError("admin/upload POST", error);
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as NodeJS.ErrnoException).code)
        : "";
    if (code === "EACCES" || code === "EROFS" || code === "EPERM") {
      return jsonError(
        "This server cannot write to the upload folder. Use an image URL instead.",
        503
      );
    }
    if (code === "ENOSPC") {
      return jsonError("Disk full — use an image URL instead.", 507);
    }
    return jsonError(
      "Upload could not be saved. Use an image URL for now.",
      500
    );
  }
}
