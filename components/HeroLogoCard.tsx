"use client";

import Image from "next/image";

export default function HeroLogoCard() {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/logo/nenyo-logo.png"
        alt="Nenyo Association Logo"
        width={420}   // 👈 increased size
        height={420}  // 👈 increased size
        priority
        className="object-contain"
      />
    </div>
  );
}
