import { requireCoach } from "@/lib/supabase/auth";
import { signOut } from "@/lib/supabase/auth";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "Dashboard", href: "/coach" },
  { label: "My Schedule", href: "/coach/schedule" },
  { label: "Roster", href: "/coach/roster" },
  { label: "Submit Receipt", href: "/coach/receipts/new" },
  { label: "Reimbursements", href: "/coach/reimbursements" },
  { label: "Post Highlight", href: "/coach/highlights/new" },
  { label: "Messages", href: "/coach/messages" },
];

export default async function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireCoach();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-brand-navy text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-brand-navy-light">
          <Link href="/coach" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Sandhills Select"
              width={36}
              height={36}
              className="rounded"
              unoptimized
            />
            <div>
              <p className="font-display font-bold text-sm uppercase leading-tight">
                Sandhills Select
              </p>
              <p className="text-blue-300 text-xs uppercase tracking-widest">
                Coach Portal
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 text-sm font-display font-medium uppercase tracking-wider text-blue-100 hover:text-white hover:bg-brand-navy-light rounded transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-brand-navy-light">
          <p className="text-xs text-blue-300 mb-1 truncate">{profile.full_name}</p>
          <p className="text-xs text-blue-400 mb-3 truncate">{profile.email}</p>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full px-3 py-2 text-xs font-display font-bold uppercase tracking-wider text-blue-200 hover:text-white border border-brand-navy-light hover:border-white rounded transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
