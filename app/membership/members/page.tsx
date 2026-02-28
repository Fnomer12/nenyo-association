// app/membership/members/page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function MembersPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 pt-24 sm:pt-28 pb-16">
        <p className="inline-flex w-fit rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs sm:text-sm text-zinc-700 shadow-sm">
          Membership
        </p>

        <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
          Members
        </h1>

        <p className="mt-3 max-w-2xl text-sm sm:text-base text-zinc-600 leading-relaxed">
          This page will display members soon. For now, you can register as a member below.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            href="/membership/registration"
            className="inline-flex items-center justify-center rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 px-4 py-3 text-sm"
          >
            Register as a Member
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 text-zinc-900 hover:bg-zinc-50 px-4 py-3 text-sm"
          >
            Back to Home
          </Link>
        </div>
      </section>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} Nenyo Association of Northern California
          </p>
        </div>
      </footer>
    </main>
  );
}