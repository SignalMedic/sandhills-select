import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Schedule — Sandhills Select Baseball" };

const typeLabel: Record<string, string> = {
  game: "Game",
  practice: "Practice",
  scrimmage: "Scrimmage",
};

const typeBadge: Record<string, string> = {
  game: "bg-brand-red text-white",
  practice: "bg-brand-navy text-white",
  scrimmage: "bg-gray-200 text-gray-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

type Entry = {
  id: string;
  type: "game" | "practice" | "scrimmage";
  opponent: string | null;
  location: string;
  starts_at: string;
  ends_at: string;
  notes: string | null;
  teams: { name: string; age_group: string } | null;
};

export default async function SchedulePage() {
  const supabase = await createClient();

  const { data: entries } = await supabase
    .from("schedule_entries")
    .select("*, teams(name, age_group)")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at");

  // Group by date string
  const grouped = (entries ?? []).reduce<Record<string, Entry[]>>((acc, entry) => {
    const dateKey = formatDate(entry.starts_at);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(entry as Entry);
    return acc;
  }, {});

  const dateKeys = Object.keys(grouped);

  return (
    <>
      <PageHeader
        eyebrow="Upcoming"
        title="Schedule"
        subtitle="Games, practices, and scrimmages across all teams."
      />

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {dateKeys.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <p className="font-display uppercase tracking-widest text-lg">
                No upcoming events scheduled
              </p>
              <p className="text-sm mt-2">Check back soon.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {dateKeys.map((date) => (
                <div key={date}>
                  <h2 className="font-display font-bold text-brand-navy uppercase tracking-wide text-lg border-b-2 border-brand-red pb-2 mb-4">
                    {date}
                  </h2>
                  <div className="space-y-3">
                    {grouped[date].map((entry) => (
                      <div
                        key={entry.id}
                        className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                      >
                        <div className="shrink-0 text-center w-16">
                          <p className="text-xs text-gray-400">
                            {formatTime(entry.starts_at)}
                          </p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span
                              className={`text-xs font-display font-bold uppercase tracking-wider px-2 py-0.5 rounded ${typeBadge[entry.type]}`}
                            >
                              {typeLabel[entry.type]}
                            </span>
                            {entry.teams && (
                              <span className="text-xs text-gray-500 font-display uppercase tracking-wider">
                                {entry.teams.name}
                              </span>
                            )}
                          </div>
                          <p className="font-semibold text-brand-navy">
                            {entry.type === "game" && entry.opponent
                              ? `vs. ${entry.opponent}`
                              : entry.type === "practice"
                              ? "Team Practice"
                              : entry.type === "scrimmage" && entry.opponent
                              ? `Scrimmage vs. ${entry.opponent}`
                              : "Scrimmage"}
                          </p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {entry.location}
                          </p>
                          {entry.notes && (
                            <p className="text-xs text-gray-400 mt-1">
                              {entry.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
