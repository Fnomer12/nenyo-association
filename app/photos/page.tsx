"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import PhotoCarousel from "@/components/PhotoCarousel";

type MediaItem = {
  src: string;
  type: "image" | "video";
  w?: number;
  h?: number;
  poster?: string; // optional manual poster for videos
  thumb?: string;  // ✅ generated thumbnail (data URL)
};

function getType(src: string): MediaItem["type"] {
  return src.toLowerCase().endsWith(".mp4") ? "video" : "image";
}

// ✅ Create a thumbnail from the actual video by grabbing a frame
async function getVideoThumbnail(src: string, seekTo = 0.5): Promise<string | null> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.src = src;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";

    const cleanup = () => {
      video.removeAttribute("src");
      video.load();
    };

    video.addEventListener("error", () => {
      cleanup();
      resolve(null);
    });

    video.addEventListener("loadedmetadata", () => {
      const safeTime = Math.min(seekTo, Math.max(0, (video.duration || 1) - 0.1));
      video.currentTime = safeTime;
    });

    video.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        cleanup();
        resolve(null);
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

      cleanup();
      resolve(dataUrl);
    });
  });
}

export default function PhotosPage() {
  // ✅ Add new images/videos here (grid auto grows)
  const media = useMemo<MediaItem[]>(() => {
    const items: MediaItem[] = [
      { src: "/gallery/image1.jpeg", type: "image" },
      { src: "/gallery/image2.jpeg", type: "image" },
      { src: "/gallery/image3.jpeg", type: "image" },
      { src: "/gallery/image4.jpeg", type: "image" },
      { src: "/gallery/image5.jpeg", type: "image" },
      { src: "/gallery/image6.jpeg", type: "image" },
      { src: "/gallery/image7.jpeg", type: "image" },
      { src: "/gallery/image8.jpeg", type: "image" },
      { src: "/gallery/video1.mp4", type: "video" },
      { src: "/gallery/image9.jpeg", type: "image" },
      { src: "/gallery/image10.jpeg", type: "image" },
      { src: "/gallery/image11.jpeg", type: "image" },
      { src: "/gallery/image12.jpeg", type: "image" },
      { src: "/gallery/image13.jpeg", type: "image" },
      { src: "/gallery/image14.jpeg", type: "image" },
      { src: "/gallery/video2.mp4", type: "video" },
      { src: "/gallery/image15.jpeg", type: "image" },
      { src: "/gallery/image16.jpeg", type: "image" },
      { src: "/gallery/video3.mp4", type: "video" },
      { src: "/gallery/image17.jpeg", type: "image" },
      { src: "/gallery/image18.jpeg", type: "image" },
      { src: "/gallery/image19.jpeg", type: "image" },
      { src: "/gallery/video4.mp4", type: "video" },
      { src: "/gallery/image20.jpeg", type: "image" },
      { src: "/gallery/video5.mp4", type: "video" },
    ];

    return items.map((m) => ({
      ...m,
      type: m.type ?? getType(m.src),
    }));
  }, []);

  // Carousel = first 4 IMAGES only
  const carouselImages = useMemo(
    () => media.filter((m) => m.type === "image").slice(0, 4).map((m) => m.src),
    [media]
  );

  // Meta includes image sizes + video thumbs
  const [meta, setMeta] = useState<MediaItem[]>(media);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const updated = await Promise.all(
        media.map(async (m) => {
          // ✅ VIDEO: generate thumbnail from the actual mp4
          if (m.type === "video") {
            if (m.poster) return m; // manual poster if you ever add one
            const thumb = await getVideoThumbnail(m.src, 0.5);
            return { ...m, thumb: thumb ?? undefined };
          }

          // ✅ IMAGE: get natural width/height for aspect-ratio boxes
          return await new Promise<MediaItem>((resolve) => {
            const img = new window.Image();
            img.src = m.src;

            img.onload = () =>
              resolve({
                ...m,
                w: img.naturalWidth || 1,
                h: img.naturalHeight || 1,
              });

            img.onerror = () => resolve({ ...m, w: 4, h: 3 });
          });
        })
      );

      if (!cancelled) setMeta(updated);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [media]);

  // Lightbox (modal)
  const [openItem, setOpenItem] = useState<MediaItem | null>(null);

  // ESC to close
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenItem(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* Top bar with ONLY back icon */}
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <Link
          href="/"
          aria-label="Back to home"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 hover:bg-zinc-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      {/* Gallery section */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Gallery</h1>
          <p className="mt-2 text-sm text-zinc-600">Moments from the Association.</p>
        </div>

        {/* Top moving carousel (images only) */}
        <PhotoCarousel isActive={true} images={carouselImages} />

        {/* Grid */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold">All Media</h2>

          {/* Masonry columns layout */}
          <div className="mt-4 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {meta.map((m) => {
              const ratio =
                m.type === "image" && m.w && m.h ? `${m.w} / ${m.h}` : undefined;

              return (
                <button
                  key={m.src}
                  type="button"
                  onClick={() => setOpenItem(m)}
                  className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-sm transition hover:shadow-md"
                  style={ratio ? { aspectRatio: ratio } : undefined}
                  aria-label={m.type === "video" ? "Open video" : "Open image"}
                >
                  <div className="relative w-full">
                    {/* IMAGE TILE */}
                    {m.type === "image" ? (
                      <div className="relative h-full w-full" style={{ aspectRatio: ratio }}>
                        <Image
                          src={m.src}
                          alt="Gallery media"
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      /* VIDEO TILE with generated thumbnail */
                      <div className="relative w-full overflow-hidden">
                        <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                          {m.poster || m.thumb ? (
                            <Image
                              src={m.poster ?? m.thumb!}
                              alt="Video thumbnail"
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-xs text-white/80">
                              Loading preview...
                            </div>
                          )}

                          {/* play badge */}
                          <div className="absolute inset-0 grid place-items-center">
                            <div className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-zinc-900 shadow">
                              ▶ Play
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lightbox modal */}
        {openItem && (
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            {/* Backdrop blur */}
            <button
              type="button"
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpenItem(null)}
              aria-label="Close"
            />

            {/* Modal content */}
            <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
                <p className="text-sm font-medium text-zinc-700">
                  {openItem.type === "video" ? "Video" : "Photo"}
                </p>
                <button
                  type="button"
                  onClick={() => setOpenItem(null)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 hover:bg-zinc-50"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative bg-black">
                {openItem.type === "image" ? (
                  <div className="relative h-[70vh] w-full">
                    <Image
                      src={openItem.src}
                      alt="Opened media"
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority
                    />
                  </div>
                ) : (
                  <div className="w-full">
                    <video
                      className="h-[70vh] w-full bg-black object-contain"
                      controls
                      autoPlay
                      playsInline
                      preload="metadata"
                    >
                      <source src={openItem.src} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
