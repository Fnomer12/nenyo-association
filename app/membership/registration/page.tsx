// app/membership/registration/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

type MembershipType = "General" | "Student" | "Family" | "Supporter";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  membershipType: MembershipType;
  message: string;
  consent: boolean;
};

const INITIAL: FormState = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  membershipType: "General",
  message: "",
  consent: false,
};

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export default function RegistrationPage() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (!form.fullName.trim()) return false;
    if (!isEmail(form.email)) return false;
    if (!form.phone.trim()) return false;
    if (!form.location.trim()) return false;
    if (!form.consent) return false;
    return true;
  }, [form]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!canSubmit) {
      setError("Please fill all required fields correctly.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.ok) {
        setError(
          data?.error ||
            `Failed to submit (HTTP ${res.status}). Check server logs / API response.`
        );
        return;
      }

      setSubmitted(true);
      setForm(INITIAL);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 pt-24 sm:pt-28 pb-10">
        <p className="inline-flex w-fit rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs sm:text-sm text-zinc-700 shadow-sm">
          Membership
        </p>

        <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
          Membership Registration
        </h1>

        <p className="mt-3 max-w-2xl text-sm sm:text-base text-zinc-600 leading-relaxed">
          Join the Nenyo Association of Northern California. Submit your details
          and we’ll follow up with next steps.
        </p>

        <div className="mt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 hover:underline"
          >
            Back to Home <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* LEFT */}
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-semibold">What you get</h2>

            <ul className="mt-4 space-y-3 text-sm text-zinc-700">
              <li>• Access to community events and cultural programs</li>
              <li>• Support network for members and families</li>
              <li>• Updates about outreach and initiatives</li>
              <li>• Opportunities to volunteer and contribute</li>
            </ul>

            <div className="mt-8 rounded-2xl bg-white border border-zinc-200 p-5">
              <h3 className="text-sm font-semibold text-zinc-900">Note</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Please make sure your email and phone number are correct so we
                can reach you quickly.
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm">
            {submitted ? (
              <div className="flex flex-col items-center text-center py-10">
                <CheckCircle2 className="h-10 w-10" />
                <h2 className="mt-4 text-xl font-semibold">
                  Registration submitted
                </h2>
                <p className="mt-2 text-sm text-zinc-600 max-w-md">
                  Thank you! Your membership info has been saved. We’ll contact
                  you soon.
                </p>

                <button
                  onClick={() => {
                    setSubmitted(false);
                    setError(null);
                  }}
                  className="mt-6 rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-zinc-600">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      value={form.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-300"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-zinc-600">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-300"
                      placeholder="you@email.com"
                      type="email"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-zinc-600">
                      Phone <span className="text-red-600">*</span>
                    </label>
                    <input
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-300"
                      placeholder="+1 (xxx) xxx-xxxx"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-zinc-600">
                      Location <span className="text-red-600">*</span>
                    </label>
                    <input
                      value={form.location}
                      onChange={(e) => update("location", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-300"
                      placeholder="Fairfield, CA / Ghana / etc."
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-600">
                    Membership Type <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={form.membershipType}
                    onChange={(e) =>
                      update("membershipType", e.target.value as MembershipType)
                    }
                    className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-300 bg-white"
                  >
                    <option value="General">General</option>
                    <option value="Student">Student</option>
                    <option value="Family">Family</option>
                    <option value="Supporter">Supporter</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-600">
                    Message (optional)
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    className="mt-1 w-full min-h-[110px] rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-300"
                    placeholder="Any questions or notes..."
                  />
                </div>

                <label className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => update("consent", e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-zinc-700 leading-relaxed">
                    I confirm the information provided is accurate, and I agree
                    to be contacted by the association.
                    <span className="text-red-600"> *</span>
                  </span>
                </label>

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Registration"
                  )}
                </button>

                <p className="text-xs text-zinc-500">
                  Your information will be saved securely to our database.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
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