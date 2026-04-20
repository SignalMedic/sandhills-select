import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Admin Dashboard — Sandhills Select" };

export default async function AdminDashboard() {
  const profile = await requireAdmin();
  const supabase = await createClient();

  const [
    { count: pendingReimbursements },
    { count: pendingHighlights },
    { count: unreadMessages },
  ] = await Promise.all([
    supabase
      .from("reimbursement_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("highlights")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("read", false),
  ]);

  const stats = [
    { label: "Pending Reimbursements", value: pendingReimbursements ?? 0, href: "/admin/reimbursements", urgent: (pendingReimbursements ?? 0) > 0 },
    { label: "Highlights to Review", value: pendingHighlights ?? 0, href: "/admin/highlights", urgent: (pendingHighlights ?? 0) > 0 },
    { label: "Unread Messages", value: unreadMessages ?? 0, href: "/admin/messages", urgent: (unreadMessages ?? 0) > 0 },
  ];

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-brand-navy text-3xl uppercase">
          Welcome back, {profile.full_name.split(" ")[0]}
        </h1>
        <p className="text-gray-500 mt-1">Here&apos;s what needs your attention.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <a
            key={stat.label}
            href={stat.href}
            className={`rounded-lg p-6 border transition-shadow hover:shadow-md ${
              stat.urgent
                ? "bg-brand-red border-brand-red text-white"
                : "bg-white border-gray-200 text-brand-navy"
            }`}
          >
            <p className={`text-4xl font-display font-bold mb-1 ${stat.urgent ? "text-white" : "text-brand-navy"}`}>
              {stat.value}
            </p>
            <p className={`text-xs font-display font-bold uppercase tracking-widest ${stat.urgent ? "text-red-100" : "text-gray-400"}`}>
              {stat.label}
            </p>
          </a>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="font-display font-bold text-brand-navy text-lg uppercase mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "New Announcement", href: "/admin/announcements/new" },
            { label: "New Event", href: "/admin/events/new" },
            { label: "Update Schedule", href: "/admin/schedule" },
            { label: "Manage Teams", href: "/admin/teams" },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="px-4 py-3 bg-brand-gray border border-gray-200 rounded text-xs font-display font-bold uppercase tracking-wider text-brand-navy hover:bg-gray-200 transition-colors text-center"
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
