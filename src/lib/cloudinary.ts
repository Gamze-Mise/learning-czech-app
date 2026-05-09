import "server-only";

import { v2 as cloudinary } from "cloudinary";

function getEnv(name: string): string | undefined {
  const v = process.env[name];
  return typeof v === "string" ? v.trim() : undefined;
}

export function getCloudinary() {
  const cloudName = getEnv("CLOUDINARY_CLOUD_NAME") ?? getEnv("CLOUD_NAME");
  const apiKey = getEnv("CLOUDINARY_API_KEY") ?? getEnv("CLOUD_KEY");
  const apiSecret = getEnv("CLOUDINARY_API_SECRET") ?? getEnv("CLOUD_SECRET");

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET (or CLOUD_NAME/CLOUD_KEY/CLOUD_SECRET)."
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  return cloudinary;
}

