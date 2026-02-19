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
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % safeImages.length);
    }, 3000);
    return () => clearInterval(t);
  }, [isActive, safeImages.length]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <div className="relative aspect-[21/9] w-full md:aspect-[20/8]">
        <Image
          src={safeImages[index] || "/org/photo-1.jpg"}
          alt="Nenyo Association gallery photo"
          fill
          className="object-cover"
          priority
        />
  
        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/0" />
  
        {/* dots only */}
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
