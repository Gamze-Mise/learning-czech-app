"use client";

import React, { useEffect, useMemo, useState } from "react";

type Props = {
  src?: string | null;
  alt: string;
  title?: string;
  className?: string;
  imgClassName?: string;
  /**
   * Use "contain" to avoid cropping (best for square covers).
   * Use "cover" to fill the frame (may crop).
   */
  fit?: "contain" | "cover";
  /**
   * Tailwind aspect class, e.g. "aspect-square" or "aspect-[16/9]".
   */
  aspectClassName?: string;
};

export default function CoverImage({
  src,
  alt,
  title,
  className = "",
  imgClassName = "",
  fit = "contain",
  aspectClassName = "aspect-[16/9]",
}: Props) {
  const desiredSrc = useMemo(() => {
    const trimmedSrc = typeof src === "string" ? src.trim() : "";
    const isLegacyUploadPath = trimmedSrc.startsWith("/uploads/");
    return trimmedSrc && !isLegacyUploadPath ? trimmedSrc : "/placeholder-cover.svg";
  }, [src]);

  const [currentSrc, setCurrentSrc] = useState<string>(desiredSrc);

  useEffect(() => {
    setCurrentSrc(desiredSrc);
  }, [desiredSrc]);

  const hasSrc = currentSrc.length > 0;
  const objectClass = fit === "cover" ? "object-cover" : "object-contain";

  const initials = (title ?? alt)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .filter(Boolean)
    .join("");

  return (
    <div
      className={[
        "relative overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-slate-100",
        aspectClassName,
        className,
      ].join(" ")}
    >
      {hasSrc ? (
        <>
          {fit === "contain" ? (
            <img
              src={currentSrc}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover blur-2xl scale-110 opacity-40"
              loading="lazy"
            />
          ) : null}
          <img
            src={currentSrc}
            alt={alt}
            loading="lazy"
            onError={() => {
              setCurrentSrc((prev) =>
                prev === "/placeholder-cover.svg" ? prev : "/placeholder-cover.svg"
              );
            }}
            className={["relative z-10 h-full w-full", objectClass, imgClassName].join(" ")}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-700 ring-1 ring-indigo-500/15">
              <span className="text-lg font-bold">{initials || "LC"}</span>
            </div>
            <div className="mt-2 text-[11px] font-medium text-slate-500">
              No image
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

