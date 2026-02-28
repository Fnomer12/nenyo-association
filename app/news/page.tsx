"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";

type NewsItem = {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category?: string;
};

export default function NewsPage() {
  // ✅ Replace this with your real news data later
  const allNews = useMemo<NewsItem[]>(
    () => [
      {
        id: 1,
        title: "Nenyo Annual Cultural Festival 2026",
        excerpt:
          "Join us for a celebration of culture, music, food, and unity across Northern California.",
        date: "March 10, 2026",
        category: "Events",
      },
      {
        id: 2,
        title: "Community Outreach Program Launched",
        excerpt:
          "A new initiative focused on supporting youth, families, and strengthening our community connections.",
        date: "February 25, 2026",
        category: "Community",
      },
      {
        id: 3,
        title: "Membership Drive Now Open",
        excerpt:
          "Become part of Nenyo Association and enjoy exclusive events, benefits, and community impact.",
        date: "February 10, 2026",
        category: "Membership",
      },
      // More news below (examples)
      {
        id: 4,
        title: "Nenyo Leadership Meeting Summary",
        excerpt:
          "Key updates from leadership on programs, finances, and upcoming activities for members.",
        date: "January 28, 2026",
        category: "Updates",
      },
      {
        id: 5,
        title: "Volunteer Opportunities Now Available",
        excerpt:
          "Support the association by volunteering at events and community programs across Northern California.",
        date: "January 15, 2026",
        category: "Volunteer",
      },
      {
        id: 6,
        title: "New Member Welcome & Orientation",
        excerpt:
          "An onboarding session for new members to learn about Nenyo’s mission, events, and benefits.",
        date: "December 20, 2025",
        category: "Membership",
      },
    ],
    []
  );

  const latestThree = allNews.slice(0, 3);
  const rest = allNews.slice(3);

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* Top bar */}
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <Link
          href="/"
          aria-label="Back to home"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 hover:bg-zinc-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold">Headlines</h1>
            <p className="mt-2 text-sm text-zinc-600">
              Latest updates from Nenyo Association of Northern California.
            </p>
          </div>

         
        </div>

        {/* ✅ Latest 3 on top */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold">Latest News</h2>

          <div className="mt-4 grid gap-6 md:grid-cols-3">
            {latestThree.map((n) => (
              <article
                key={n.id}
                className="flex min-h-[280px] flex-col rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-zinc-500">{n.date}</p>
                  {n.category && (
                    <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] font-medium text-zinc-700">
                      {n.category}
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-lg font-semibold text-zinc-900">
                  {n.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                  {n.excerpt}
                </p>

                <Link
                  href={`/news#news-${n.id}`}
                  className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-medium text-zinc-900 hover:underline"
                >
                  Read More →
                </Link>
              </article>
            ))}
          </div>
        </div>

        {/* ✅ Rest below */}
        <div className="mt-12 border-t border-zinc-200 pt-10">
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-lg font-semibold">More News</h2>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((n) => (
              <article
                key={n.id}
                id={`news-${n.id}`}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-zinc-500">{n.date}</p>
                  {n.category && (
                    <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] font-medium text-zinc-700">
                      {n.category}
                    </span>
                  )}
                </div>

                <h3 className="mt-2 text-base font-semibold text-zinc-900">
                  {n.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {n.excerpt}
                </p>

                <Link
                  href={`/news#news-${n.id}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-zinc-900 hover:underline"
                >
                  Read More →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
