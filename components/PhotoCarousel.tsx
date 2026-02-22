"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export default function PhotoCarousel({
  images,
  isActive,
}: {
  images: string[];
  isActive: boolean;
}) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isActive || safeImages.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % safeImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive, safeImages.length]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <div className="relative aspect-[21/9] w-full md:aspect-[20/8] overflow-hidden">

        {/* Sliding Container */}
        <div
          className="flex h-full w-full transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${index * 100}%)`,
          }}
        >
          {safeImages.map((img, i) => (
            <div key={i} className="relative min-w-full h-full">
              <Image
                src={img}
                alt={`Nenyo Association gallery photo ${i + 1}`}
                fill
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/0 pointer-events-none" />

        {/* Dots */}
        <div className="absolute bottom-5 right-5 hidden items-center gap-2 sm:flex">
          {safeImages.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to image ${i + 1}`}
              onClick={() => setIndex(i)}
              className={[
                "h-2.5 w-2.5 rounded-full border transition-all",
                i === index
                  ? "border-white bg-white"
                  : "border-white/60 bg-white/20 hover:bg-white/35",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}