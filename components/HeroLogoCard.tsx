"use client";

import Image from "next/image";
import { useState } from "react";

export default function HeroLogoCard() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex flex-col items-center justify-center py-10"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* LOGO ONLY */}
      <div
        className={[
          "relative transition-transform duration-300",
          hovered ? "scale-105" : "scale-100",
        ].join(" ")}
      >
        <div className="relative h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64">
          <Image
            src="/logo.png"
            alt="Nenyo Association logo"
            fill
            className="object-contain drop-shadow-md"
            priority
          />
        </div>
      </div>

      {/* Text */}
      <h2 className="mt-6 text-center text-xl font-semibold text-zinc-900">
        Nenyo Association of Northern California
      </h2>

      <p className="mt-2 text-center text-sm text-zinc-600">
        Community • Culture • Connection
      </p>
    </div>
  );
}
