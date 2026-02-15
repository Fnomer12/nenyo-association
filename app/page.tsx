"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import HeroLogoCard from "@/components/HeroLogoCard";
import PhotoCarousel from "@/components/PhotoCarousel";
import AboutSection from "@/components/AboutSection";

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const obs = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, options);

    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);

  return { ref, inView };
}

export default function HomePage() {
  const gallery = useInView<HTMLDivElement>({ threshold: 0.35 });
  const about = useInView<HTMLDivElement>({ threshold: 0.25 });

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 pt-24 pb-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-700">
              Welcome
            </p>

            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Nenyo Association of Northern California
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600">
              Community, culture, support, and celebration — building strong
              connections across Northern California.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="/membership/registration"
                className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Become a Member
              </a>
              <a
                href="/#gallery"
                className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
              >
                View Photos
              </a>
            </div>
          </div>

          {/* LOGO */}
          <div className="flex justify-center lg:justify-end">
            <HeroLogoCard />
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section
        id="gallery"
        ref={gallery.ref}
        className="mt-12 border-t border-zinc-200 bg-white"
      >
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold">
                Moments from the Association
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-zinc-600">
                As you scroll here, the photos become card-like and rotate every
                3 seconds.
              </p>
            </div>

            <Link
              href="/photos"
              className="hidden rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 sm:inline-flex"
            >
              View Gallery
            </Link>
          </div>

          <div className="mt-8">
            <PhotoCarousel
              isActive={gallery.inView}
              images={[
                "/org/photo-1.jpg",
                "/org/photo-2.jpg",
                "/org/photo-3.jpg",
                "/org/photo-4.jpg",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        ref={about.ref}
        className="mt-16 border-t border-zinc-200 bg-zinc-50"
      >
        <AboutSection active={about.inView} />
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} Nenyo Association of Northern California
          </p>

          <div className="flex gap-4 text-sm">
            <a className="text-zinc-600 hover:text-zinc-900" href="/#about">
              About
            </a>
            <a className="text-zinc-600 hover:text-zinc-900" href="/news">
              News
            </a>
            <a className="text-zinc-600 hover:text-zinc-900" href="/photos">
              Photos
            </a>
            <a
              className="text-zinc-600 hover:text-zinc-900"
              href="/membership/registration"
            >
              Membership
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
