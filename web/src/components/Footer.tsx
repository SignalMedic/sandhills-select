import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="Sandhills Select Baseball"
                width={48}
                height={48}
                className="rounded shrink-0"
              />
              <div>
                <div className="font-display font-bold text-lg leading-tight tracking-wide uppercase">
                  Sandhills Select
                </div>
                <div className="text-xs text-blue-200 tracking-widest uppercase">
                  Baseball
                </div>
              </div>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed max-w-sm">
              Premier youth travel baseball organization developing athletes and
              building character in the Sandhills region.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display font-bold tracking-wider uppercase text-sm mb-4 text-white">
              Organization
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Teams", href: "/teams" },
                { label: "Schedule", href: "/schedule" },
                { label: "Events", href: "/events" },
                { label: "News", href: "/news" },
                { label: "Highlights", href: "/highlights" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-200 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-bold tracking-wider uppercase text-sm mb-4 text-white">
              Contact
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-blue-200 hover:text-white text-sm transition-colors"
                >
                  Send a Message
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-blue-200 hover:text-white text-sm transition-colors"
                >
                  Register for Events
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-brand-navy-light flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-blue-300">
          <p>
            &copy; {new Date().getFullYear()} Sandhills Select Baseball. All
            rights reserved.
          </p>
          <p>Non-profit youth baseball organization</p>
        </div>
      </div>
    </footer>
  );
}
