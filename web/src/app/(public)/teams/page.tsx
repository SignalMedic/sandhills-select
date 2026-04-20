import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import Image from "next/image";

export const metadata = { title: "Teams — Sandhills Select Baseball" };

export default async function TeamsPage() {
  const supabase = await createClient();

  const { data: teams } = await supabase
    .from("teams")
    .select(`
      *,
      coach_teams(
        is_head_coach,
        profiles(full_name)
      ),
      team_links(id, label, url)
    `)
    .eq("active", true)
    .order("age_group");

  return (
    <>
      <PageHeader
        eyebrow="Our Organization"
        title="Teams"
        subtitle="Sandhills Select fields competitive travel teams across multiple age groups."
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!teams || teams.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <p className="font-display uppercase tracking-widest text-lg">
                Teams coming soon
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => {
                const headCoach = team.coach_teams?.find(
                  (ct: { is_head_coach: boolean }) => ct.is_head_coach
                );
                const otherCoaches = team.coach_teams?.filter(
                  (ct: { is_head_coach: boolean }) => !ct.is_head_coach
                );

                return (
                  <div
                    key={team.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="bg-brand-navy p-6 flex items-center gap-4">
                      <Image
                        src="/logo.png"
                        alt="Sandhills Select"
                        width={56}
                        height={56}
                        className="rounded"
                        unoptimized
                      />
                      <div>
                        <h2 className="font-display font-bold text-white text-xl uppercase leading-tight">
                          {team.name}
                        </h2>
                        <p className="text-blue-200 text-sm">
                          {team.age_group} · {team.season}
                        </p>
                      </div>
                    </div>
                    <div className="p-6">
                      {headCoach && (
                        <div className="mb-3">
                          <span className="text-xs font-display font-bold uppercase tracking-widest text-brand-red">
                            Head Coach
                          </span>
                          <p className="text-brand-navy font-semibold mt-0.5">
                            {(headCoach as { profiles: { full_name: string } }).profiles?.full_name}
                          </p>
                        </div>
                      )}
                      {otherCoaches && otherCoaches.length > 0 && (
                        <div>
                          <span className="text-xs font-display font-bold uppercase tracking-widest text-gray-400">
                            Coaches
                          </span>
                          {otherCoaches.map(
                            (ct: { profiles: { full_name: string } }, i: number) => (
                              <p key={i} className="text-gray-700 text-sm mt-0.5">
                                {ct.profiles?.full_name}
                              </p>
                            )
                          )}
                        </div>
                      )}
                      {!headCoach && (!otherCoaches || otherCoaches.length === 0) && (
                        <p className="text-gray-400 text-sm">Coaches TBA</p>
                      )}
                      {team.team_links && team.team_links.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                          {(team.team_links as { id: string; label: string; url: string }[]).map((link) => (
                            <a
                              key={link.id}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1.5 rounded border border-brand-navy text-brand-navy text-xs font-display font-bold uppercase tracking-wider hover:bg-brand-navy hover:text-white transition-colors"
                            >
                              {link.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
