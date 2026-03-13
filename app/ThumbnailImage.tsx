"use client";

export function ThumbnailImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover"
      onError={(e) => {
        const img = e.currentTarget as HTMLImageElement;
        const fallback = img.src.replace("maxresdefault.jpg", "hqdefault.jpg");
        if (fallback !== img.src) {
          img.src = fallback;
        } else {
          img.style.display = "none";
        }
      }}
    />
  );
}
