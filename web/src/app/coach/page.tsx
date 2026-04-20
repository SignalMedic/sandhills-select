import { requireCoach } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = { title: "Coach Dashboard — Sandhills Select" };

export default async function CoachDashboard() {
  const profile = await requireCoach();
  const supabase = await createClient();

  const [{ data: reimbursements }, { data: highlights }, { data: scheduleEntries }] =
    await Promise.all([
      supabase
        .from("reimbursement_requests")
        .select("id, title, status, total_amount_cents, created_at")
        .eq("coach_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("highlights")
        .select("id, caption, status, created_at")
        .eq("coach_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("schedule_entries")
        .select("*, teams(name)")
        .in(
          "team_id",
          (
            await supabase
              .from("coach_teams")
              .select("team_id")
              .eq("coach_id", profile.id)
          ).data?.map((ct) => ct.team_id) ?? []
        )
        .gte("starts_at", new Date().toISOString())
        .order("starts_at")
        .limit(5),
    ]);

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    under_review: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    paid: "bg-green-100 text-green-800",
    denied: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-brand-navy text-3xl uppercase">
          Welcome, {profile.full_name.split(" ")[0]}
        </h1>
        <p className="text-gray-500 mt-1">Coach Portal</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {[
          { label: "Submit Receipt", href: "/coach/receipts/new", primary: true },
          { label: "Post Highlight", href: "/coach/highlights/new", primary: false },
          { label: "View Schedule", href: "/coach/schedule", primary: false },
          { label: "Messages", href: "/coach/messages", primary: false },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`px-4 py-4 rounded text-xs font-display font-bold uppercase tracking-wider text-center transition-colors ${
              action.primary
                ? "bg-brand-red text-white hover:bg-red-700"
                : "bg-white border border-gray-200 text-brand-navy hover:bg-gray-50"
            }`}
          >
            {action.label}
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming schedule */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="font-display font-bold text-brand-navy text-lg uppercase mb-4">
            Upcoming Schedule
          </h2>
          {!scheduleEntries || scheduleEntries.length === 0 ? (
            <p className="text-gray-400 text-sm">No upcoming events.</p>
          ) : (
            <div className="space-y-3">
              {scheduleEntries.map((entry) => (
                <div key={entry.id} className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-brand-red shrink-0" />
                  <div>
                    <p className="font-semibold text-brand-navy capitalize">
                      {entry.type}{entry.opponent ? ` vs. ${entry.opponent}` : ""}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {new Date(entry.starts_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
                      })} · {entry.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent reimbursements */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="font-display font-bold text-brand-navy text-lg uppercase mb-4">
            Recent Reimbursements
          </h2>
          {!reimbursements || reimbursements.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-400 text-sm mb-3">No submissions yet.</p>
              <Link
                href="/coach/receipts/new"
                className="text-xs font-display font-bold uppercase tracking-wider text-brand-red"
              >
                Submit your first receipt →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {reimbursements.map((r) => (
                <div key={r.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-brand-navy">{r.title}</p>
                    <p className="text-gray-400 text-xs">
                      ${((r.total_amount_cents ?? 0) / 100).toFixed(2)}
                    </p>
                  </div>
                  <span className={`text-xs font-display font-bold uppercase px-2 py-0.5 rounded ${statusColor[r.status] ?? ""}`}>
                    {r.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent highlights */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 lg:col-span-2">
          <h2 className="font-display font-bold text-brand-navy text-lg uppercase mb-4">
            My Highlights
          </h2>
          {!highlights || highlights.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-400 text-sm mb-3">No highlights posted yet.</p>
              <Link
                href="/coach/highlights/new"
                className="text-xs font-display font-bold uppercase tracking-wider text-brand-red"
              >
                Post your first highlight →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {highlights.map((h) => (
                <div key={h.id} className="py-3 flex items-center justify-between">
                  <p className="text-sm text-gray-700 truncate flex-1 mr-4">{h.caption}</p>
                  <span className={`text-xs font-display font-bold uppercase px-2 py-0.5 rounded shrink-0 ${statusColor[h.status] ?? ""}`}>
                    {h.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
