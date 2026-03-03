"use client";

import { useState } from "react";

const PLAYLIST_ID = "PLBMURYQJTU0fXfLsBqz5GPSQ_S-vANsOu";

type Video = { id: string; title: string };

export default function VideoGrid({ videos }: { videos: Video[] }) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {videos.map((video) => (
        <div key={video.id}>
          {playingId === video.id ? (
            <div className="overflow-hidden rounded-lg" style={{ aspectRatio: "16/9" }}>
              <iframe
                src={`https://www.youtube.com/embed/${video.id}?autoplay=1&list=${PLAYLIST_ID}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          ) : (
            <button
              onClick={() => setPlayingId(video.id)}
              className="group w-full text-left"
            >
              <div
                className="relative overflow-hidden rounded-lg"
                style={{ aspectRatio: "16/9", background: "var(--warm-placeholder)" }}
              >
                <img
                  src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                  alt={video.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                  }}
                />
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full"
                    style={{ background: "rgba(0,0,0,0.55)" }}
                  >
                    <svg
                      className="ml-0.5 h-4 w-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p
                className="mt-2 text-xs leading-snug italic"
                style={{ color: "var(--foreground)" }}
              >
                {video.title}
              </p>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
