"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type NavLink = { label: string; href: string };

const mainLinks: NavLink[] = [
  { label: "Photos", href: "/#gallery" },
  { label: "About Us", href: "/#about" },
  { label: "News", href: "/#news" },
  { label: "Events", href: "/events" },
  
];

const membershipLinks: NavLink[] = [
  { label: "Registration", href: "/membership/registration" },
  { label: "Members", href: "/membership/members" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [membershipOpen, setMembershipOpen] = useState(false);
  const [membershipOpenMobile, setMembershipOpenMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Show logo in header after scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) setMembershipOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const closeAll = () => {
    setMobileOpen(false);
    setMembershipOpen(false);
    setMembershipOpenMobile(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        {/* Brand (logo appears here after scroll) */}
        <Link
          href="/"
          onClick={closeAll}
          aria-label="Nenyo Association Home"
          className="flex items-center gap-3"
        >
          <div
            className={`transition-all duration-300 ease-in-out ${
              scrolled
                ? "opacity-100 scale-100"
                : "opacity-0 scale-75 pointer-events-none"
            }`}
          >
            <Image
              src="/logo/nenyo-logo.png"
              alt="Nenyo Association Logo"
              width={44}
              height={44}
              className="object-contain"
              priority
            />
          </div>

          <span
            className={`hidden sm:block text-base font-semibold tracking-tight transition-all duration-300 ${
              scrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
            }`}
          >
            Nenyo Association
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-7 md:flex">
          {mainLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={closeAll}
              className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
            >
              {l.label}
            </Link>
          ))}

          {/* Membership dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setMembershipOpen((v) => !v)}
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 hover:text-zinc-900"
              aria-haspopup="menu"
              aria-expanded={membershipOpen}
            >
              Membership
              <span className="text-zinc-400">▾</span>
            </button>

            {membershipOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-3 w-52 rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm"
              >
                {membershipLinks.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={closeAll}
                    className="block rounded-xl px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                    role="menuitem"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 md:hidden"
          aria-label="Open menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-zinc-200 bg-white md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex flex-col gap-1">
              {mainLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={closeAll}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                >
                  {l.label}
                </Link>
              ))}

              <button
                type="button"
                onClick={() => setMembershipOpenMobile((v) => !v)}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                aria-expanded={membershipOpenMobile}
              >
                Membership
                <span className="text-zinc-400">
                  {membershipOpenMobile ? "▴" : "▾"}
                </span>
              </button>

              {membershipOpenMobile && (
                <div className="ml-2 flex flex-col gap-1 border-l border-zinc-200 pl-2">
                  {membershipLinks.map((l) => (
                    <Link
                      key={l.label}
                      href={l.href}
                      onClick={closeAll}
                      className="rounded-xl px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
