"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { label: string; href: string };

interface MobileNavProps {
  navItems: NavItem[];
  portalLabel: string;
  homeHref: string;
  userName: string;
  userEmail: string;
  signOutAction: () => Promise<void>;
}

export default function MobileNav({
  navItems,
  portalLabel,
  homeHref,
  userName,
  userEmail,
  signOutAction,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Top bar — only visible on mobile */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-brand-navy text-white border-b border-brand-navy-light shrink-0">
        <Link href={homeHref} className="flex items-center gap-2">
          <Image src="/logo.png" alt="Sandhills Select" width={28} height={28} unoptimized />
          <div>
            <p className="font-display font-bold text-xs uppercase leading-tight">Sandhills Select</p>
            <p className="text-blue-300 text-[10px] uppercase tracking-widest">{portalLabel}</p>
          </div>
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="p-2 rounded hover:bg-brand-navy-light transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="2" y1="5" x2="20" y2="5" />
            <line x1="2" y1="11" x2="20" y2="11" />
            <line x1="2" y1="17" x2="20" y2="17" />
          </svg>
        </button>
      </header>

      {/* Backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-brand-navy text-white flex flex-col z-50 transform transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-brand-navy-light flex items-center justify-between">
          <Link href={homeHref} className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <Image src="/logo.png" alt="Sandhills Select" width={36} height={36} className="rounded" unoptimized />
            <div>
              <p className="font-display font-bold text-sm uppercase leading-tight">Sandhills Select</p>
              <p className="text-blue-300 text-xs uppercase tracking-widest">{portalLabel}</p>
            </div>
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="p-1 rounded hover:bg-brand-navy-light transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="3" x2="17" y2="17" />
              <line x1="17" y1="3" x2="3" y2="17" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2.5 text-sm font-display font-medium uppercase tracking-wider text-blue-100 hover:text-white hover:bg-brand-navy-light rounded transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-brand-navy-light">
          <p className="text-xs text-blue-300 mb-1 truncate">{userName}</p>
          <p className="text-xs text-blue-400 mb-3 truncate">{userEmail}</p>
          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full px-3 py-2 text-xs font-display font-bold uppercase tracking-wider text-blue-200 hover:text-white border border-brand-navy-light hover:border-white rounded transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
