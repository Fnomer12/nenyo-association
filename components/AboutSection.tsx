"use client";

export default function AboutSection({ active }: { active: boolean }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div
        className={[
          "transition-all duration-500",
          active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-95",
        ].join(" ")}
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700">
            About Us
          </span>
          
        </div>

        <h2 className="mt-6 text-3xl font-semibold leading-tight sm:text-4xl">
          Building strong community connections across Northern California
        </h2>

        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-600 sm:text-base">
        We are a community organization formed by Ewe natives from Ghana living in the diaspora. Our mission is to preserve our rich cultural heritage, promote unity, and build a strong support system for our members and their families.

Through mentorship, cultural education, community programs, and local engagement, we create meaningful opportunities for connection, growth, and collective development — ensuring that our traditions remain alive while empowering the next generation to thrive wherever they are in the world.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/about"
            className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Learn More
          </a>

          <a
            href="/membership/registration"
            className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Become a Member
          </a>
        </div>
      </div>
    </div>
  );
}
