import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";

export const metadata = { title: "Events — Sandhills Select Baseball" };

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
  if (s.getFullYear() !== e.getFullYear()) {
    return `${s.toLocaleDateString("en-US", { ...opts, year: "numeric" })} – ${e.toLocaleDateString("en-US", { ...opts, year: "numeric" })}`;
  }
  if (s.getMonth() !== e.getMonth()) {
    return `${s.toLocaleDateString("en-US", opts)} – ${e.toLocaleDateString("en-US", { ...opts, year: "numeric" })}`;
  }
  return `${s.toLocaleDateString("en-US", { month: "long", day: "numeric" })}–${e.getDate()}, ${e.getFullYear()}`;
}

function formatPrice(cents: number) {
  if (cents === 0) return "Free";
  return `$${(cents / 100).toFixed(0)}`;
}

export default async function EventsPage() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .order("start_date");

  const upcoming = (events ?? []).filter(
    (e) => new Date(e.end_date) >= new Date()
  );
  const past = (events ?? []).filter((e) => new Date(e.end_date) < new Date());

  return (
    <>
      <PageHeader
        eyebrow="Get Involved"
        title="Events"
        subtitle="Tournaments, tryouts, and organization events open for registration."
      />

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {upcoming.length === 0 && past.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <p className="font-display uppercase tracking-widest text-lg">
                No events posted yet
              </p>
              <p className="text-sm mt-2">Check back soon.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {upcoming.length > 0 && (
                <div>
                  <h2 className="font-display font-bold text-brand-navy text-2xl uppercase tracking-wide mb-6">
                    Upcoming Events
                  </h2>
                  <div className="space-y-4">
                    {upcoming.map((event) => (
                      <div
                        key={event.id}
                        className="border border-gray-200 rounded-lg overflow-hidden flex hover:shadow-md transition-shadow"
                      >
                        <div className="w-2 bg-brand-red shrink-0" />
                        <div className="p-6 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-display font-bold text-brand-navy text-xl uppercase mb-3">
                                {event.name}
                              </h3>
                              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-600 mb-3">
                                <p>
                                  <span className="font-semibold text-gray-800">
                                    Dates:
                                  </span>{" "}
                                  {formatDateRange(event.start_date, event.end_date)}
                                </p>
                                <p>
                                  <span className="font-semibold text-gray-800">
                                    Location:
                                  </span>{" "}
                                  {event.location}
                                </p>
                                {event.age_groups?.length > 0 && (
                                  <p>
                                    <span className="font-semibold text-gray-800">
                                      Age Groups:
                                    </span>{" "}
                                    {event.age_groups.join(", ")}
                                  </p>
                                )}
                                <p>
                                  <span className="font-semibold text-gray-800">
                                    Entry:
                                  </span>{" "}
                                  {formatPrice(event.price_cents)}
                                </p>
                              </div>
                              {event.description && (
                                <p className="text-sm text-gray-600">
                                  {event.description}
                                </p>
                              )}
                            </div>
                            <div className="shrink-0">
                              {event.registration_open ? (
                                <Link
                                  href={`/events/${event.id}/register`}
                                  className="inline-block px-6 py-2.5 bg-brand-red text-white text-sm font-display font-bold uppercase tracking-wider rounded hover:bg-red-700 transition-colors"
                                >
                                  Register
                                </Link>
                              ) : (
                                <span className="inline-block px-6 py-2.5 bg-gray-100 text-gray-400 text-sm font-display font-bold uppercase tracking-wider rounded">
                                  Registration Closed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {past.length > 0 && (
                <div>
                  <h2 className="font-display font-bold text-gray-400 text-xl uppercase tracking-wide mb-6">
                    Past Events
                  </h2>
                  <div className="space-y-3">
                    {past.map((event) => (
                      <div
                        key={event.id}
                        className="border border-gray-100 rounded-lg p-4 flex items-center gap-4 text-gray-400"
                      >
                        <div className="flex-1">
                          <span className="font-display font-bold uppercase text-gray-500">
                            {event.name}
                          </span>
                          <span className="mx-3 text-gray-300">·</span>
                          <span className="text-sm">
                            {formatDateRange(event.start_date, event.end_date)}
                          </span>
                          <span className="mx-3 text-gray-300">·</span>
                          <span className="text-sm">{event.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
