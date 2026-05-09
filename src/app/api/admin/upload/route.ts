import { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { jsonError, jsonOk, logApiError } from "@/lib/api-response";
import { getCloudinary } from "@/lib/cloudinary";

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
    const publicId = `${Date.now()}-${randomBytes(8).toString("hex")}`;

    let result: { secure_url?: string };
    try {
      const cloudinary = getCloudinary();
      result = await new Promise<{ secure_url?: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "learning-czech/admin",
            public_id: publicId,
            overwrite: false,
            format: ext,
          },
          (err, res) => {
            if (err) return reject(err);
            resolve(res ?? {});
          }
        );
        stream.end(buffer);
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "";
      if (message.includes("Cloudinary is not configured")) {
        return jsonError("Cloudinary is not configured on this server.", 503);
      }
      throw e;
    }

    const url = typeof result.secure_url === "string" ? result.secure_url : "";
    if (!url) {
      return jsonError("Upload failed (no URL returned).", 502);
    }
    return jsonOk({ url });
  } catch (error) {
    logApiError("admin/upload POST", error);
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as NodeJS.ErrnoException).code)
        : "";
    return jsonError(
      "Upload could not be saved. Use an image URL for now.",
      500
    );
  }
}
