"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const links = [
  { label: "Teams", href: "/teams" },
  { label: "Schedule", href: "/schedule" },
  { label: "Events", href: "/events" },
  { label: "News", href: "/news" },
  { label: "Highlights", href: "/highlights" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-brand-navy text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo.png"
              alt="Sandhills Select Baseball"
              width={48}
              height={48}
              className="rounded"
              priority
            />
            <div className="hidden sm:block">
              <div className="font-display font-bold text-lg leading-tight tracking-wide uppercase">
                Sandhills Select
              </div>
              <div className="text-xs text-blue-200 tracking-widest uppercase">
                Baseball
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-display font-medium tracking-wider uppercase text-blue-100 hover:text-white hover:bg-brand-navy-light rounded transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/events"
              className="ml-4 px-5 py-2 bg-brand-red text-white text-sm font-display font-bold tracking-wider uppercase rounded hover:bg-red-700 transition-colors"
            >
              Register
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded text-blue-100 hover:text-white hover:bg-brand-navy-light transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-brand-navy-light">
          <nav className="flex flex-col px-4 py-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-display font-medium tracking-wider uppercase text-blue-100 hover:text-white border-b border-brand-navy-light last:border-0"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/events"
              onClick={() => setOpen(false)}
              className="my-3 px-5 py-2 bg-brand-red text-white text-sm font-display font-bold tracking-wider uppercase rounded text-center hover:bg-red-700 transition-colors"
            >
              Register
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
