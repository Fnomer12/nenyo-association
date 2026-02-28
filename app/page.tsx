// app/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import HeroLogoCard from "@/components/HeroLogoCard";
import PhotoCarousel from "@/components/PhotoCarousel";
import AboutSection from "@/components/AboutSection";
import { ArrowRight } from "lucide-react";

/** ---------- InView hook ---------- */
function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, options);

    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);

  return { ref, inView };
}

/** ---------- Types ---------- */
type NewsItem = {
  id: number;
  title: string;
  excerpt: string;
  date: string;
};

/** ---------- Static presence map (image edited in Canva) ---------- */
function WorldPresenceMap() {
  return (
    <section className="mt-12 sm:mt-16 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-14">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-6 mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold">Our Presence</h2>
          
        </div>

        <img
          src="/images/world-map.png"
          alt="Nenyo Association Presence Map"
          className="w-full h-auto object-contain"
          loading="lazy"
        />
      </div>
    </section>
  );
}

/** ---------- Merch strip (1 shirt file + 1 cap file, same line, no borders) ---------- */
function MerchStrip() {
  /**
   * Put these files in:
   * public/merch/shirt.png
   * public/merch/cap.png
   *
   * If your files are .jpg, change extensions below.
   */
  return (
    <section className="mt-12 sm:mt-16 border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-14">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">Official Merch</h2>
            <p className="mt-1 text-sm text-zinc-600">
              T-shirt and cap available for members and supporters.
            </p>
          </div>

          {/* Optional: remove if you don't want a button here */}
          
        </div>

        {/* same horizontal line, no borders, responsive */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-16">
          <div className="group">
            <img
              src="/merch/nenyo-shirt.png"
              alt="Nenyo T-Shirt"
              className="h-[240px] sm:h-[280px] md:h-[320px] w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          <div className="group">
            <img
              src="/merch/nenyo-cap.png"
              alt="Nenyo Cap"
              className="h-[240px] sm:h-[280px] md:h-[320px] w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const gallery = useInView<HTMLDivElement>({ threshold: 0.35 });
  const about = useInView<HTMLDivElement>({ threshold: 0.25 });

  const latestNews: NewsItem[] = useMemo(
    () => [
      {
        id: 1,
        title: "Nenyo Annual Cultural Festival 2026",
        excerpt:
          "Join us for a celebration of culture, music, and unity in Northern California.",
        date: "March 10, 2026",
      },
      {
        id: 2,
        title: "Community Outreach Program Launched",
        excerpt:
          "We’ve launched a new initiative to support families and youth in our community.",
        date: "February 25, 2026",
      },
      {
        id: 3,
        title: "Membership Drive Now Open",
        excerpt:
          "Become a member and enjoy exclusive benefits and event access.",
        date: "February 10, 2026",
      },
    ],
    []
  );

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      {/* HERO */}
      <section className="relative mx-auto max-w-6xl px-4 pt-24 sm:pt-28 lg:pt-32 pb-14 overflow-hidden">
        {/* Mobile Background Logo */}
        <div className="absolute inset-0 flex justify-center items-center sm:hidden pointer-events-none">
          <div className="w-[95%] opacity-60 blur-md scale-105">
            <HeroLogoCard />
          </div>
          <div className="absolute inset-0 bg-white/20" />
        </div>

        <div className="relative z-10 grid gap-10 sm:grid-cols-2 sm:items-center">
          {/* LEFT */}
          <div className="min-w-0">
            <p className="mb-3 inline-flex rounded-full border border-zinc-200 px-3 py-1 text-xs sm:text-sm text-zinc-700 bg-white/90 backdrop-blur-sm shadow-sm">
              Home
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
              Nenyo Association of Northern California
            </h1>

            <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-zinc-600">
              Community, culture, support, and celebration — building strong
              connections across Northern California.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 max-w-md">
              <Link
                href="/membership/registration"
                className="inline-flex items-center justify-center rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 px-4 py-3 text-sm"
              >
                Become a Member
              </Link>

              
            </div>
          </div>

          {/* RIGHT (Desktop Logo Only) */}
          <div className="hidden sm:flex justify-end">
            <div className="w-full max-w-[280px] md:max-w-[360px] lg:max-w-[460px]">
              <HeroLogoCard />
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section
        id="gallery"
        ref={gallery.ref}
        className="mt-10 sm:mt-12 border-t border-zinc-200 bg-white"
      >
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-6">
            <h2 className="text-xl sm:text-2xl font-semibold">
              Moments from the Association
            </h2>

            <Link
              href="/photos"
              className="group inline-flex w-fit items-center gap-2 rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              View Gallery
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-2" />
            </Link>
          </div>

          <div className="mt-6 sm:mt-8">
            <PhotoCarousel
              isActive={gallery.inView}
              images={[
                "/gallery/image1.jpeg",
                "/gallery/image2.jpeg",
                "/gallery/image3.jpeg",
                "/gallery/image4.jpeg",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        ref={about.ref}
        className="mt-12 sm:mt-16 border-t border-zinc-200 bg-zinc-50"
      >
        <AboutSection active={about.inView} />
      </section>

      {/* NEWS */}
      <section id="news" className="mt-12 sm:mt-16 border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-6">
            <h2 className="text-xl sm:text-2xl font-semibold">Latest News</h2>

            <Link
              href="/news"
              className="group inline-flex w-fit items-center gap-2 rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              Headlines
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-2" />
            </Link>
          </div>

          <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((n) => (
              <article
                key={n.id}
                className="flex h-full flex-col rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm transition hover:shadow-md"
              >
                <p className="text-xs text-zinc-500">{n.date}</p>

                <h3 className="mt-2 text-base sm:text-lg font-semibold text-zinc-900">
                  {n.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                  {n.excerpt}
                </p>

                <Link
                  href="/news"
                  className="mt-auto inline-flex items-center gap-1 pt-5 sm:pt-6 text-sm font-medium text-zinc-900 hover:underline"
                >
                  Read More →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* MAP */}
      <WorldPresenceMap />

      {/* MERCH (1 shirt + 1 cap on same line, no borders) */}
      <MerchStrip />

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} Nenyo Association of Northern California
          </p>
        </div>
      </footer>
    </main>
  );
}