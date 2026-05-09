"use client";

import React, { useMemo, useState } from "react";

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

  const hasSrc = desiredSrc.length > 0;
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
        <CoverImageContent
          key={desiredSrc}
          src={desiredSrc}
          alt={alt}
          fit={fit}
          objectClass={objectClass}
          imgClassName={imgClassName}
        />
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

function CoverImageContent({
  src,
  alt,
  fit,
  objectClass,
  imgClassName,
}: {
  src: string;
  alt: string;
  fit: "contain" | "cover";
  objectClass: string;
  imgClassName: string;
}) {
  const [displaySrc, setDisplaySrc] = useState<string>(src);
  const [loaded, setLoaded] = useState(false);

  const isPlaceholder = displaySrc === "/placeholder-cover.svg";
  const showLoadingOverlay = !isPlaceholder && !loaded;

  return (
    <>
      {fit === "contain" ? (
        <img
          src={displaySrc}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover blur-2xl scale-110 opacity-40"
          loading="lazy"
        />
      ) : null}
      {showLoadingOverlay ? (
        <div
          aria-hidden
          className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-pulse"
        />
      ) : null}
      <img
        src={displaySrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setDisplaySrc((prev) => (prev === "/placeholder-cover.svg" ? prev : "/placeholder-cover.svg"));
          setLoaded(true);
        }}
        className={["relative z-10 h-full w-full", objectClass, imgClassName].join(" ")}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
    </>
  );
}

