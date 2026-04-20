import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  if (s.toDateString() === e.toDateString()) {
    return s.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }
  return `${s.toLocaleDateString("en-US", { month: "long", day: "numeric" })} – ${e.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
}

function formatPrice(cents: number) {
  if (cents === 0) return "Free";
  return `$${(cents / 100).toFixed(0)}`;
}

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: announcements }, { data: events }] = await Promise.all([
    supabase
      .from("announcements")
      .select("id, title, body, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3),
    supabase
      .from("events")
      .select("id, name, start_date, end_date, location, age_groups, price_cents, registration_open")
      .eq("status", "published")
      .gte("end_date", new Date().toISOString())
      .order("start_date")
      .limit(3),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy text-white relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(200,16,46,0.18) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt="Sandhills Select Baseball"
            width={160}
            height={160}
            className="mb-6 drop-shadow-2xl"
            priority
          />
          <h1 className="font-display font-bold text-4xl sm:text-6xl uppercase tracking-wide leading-tight mb-4">
            Sandhills Select
            <br />
            <span className="text-brand-red">Baseball</span>
          </h1>
          <p className="text-blue-200 text-lg sm:text-xl max-w-2xl mb-10">
            Elite youth travel baseball developing champions on and off the
            field in the Sandhills region of North Carolina.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/events"
              className="px-8 py-3 bg-brand-red text-white font-display font-bold uppercase tracking-wider rounded hover:bg-red-700 transition-colors text-sm"
            >
              Register for Events
            </Link>
            <Link
              href="/schedule"
              className="px-8 py-3 border-2 border-white text-white font-display font-bold uppercase tracking-wider rounded hover:bg-white hover:text-brand-navy transition-colors text-sm"
            >
              View Schedule
            </Link>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-brand-red font-display font-bold uppercase tracking-widest text-sm mb-1">
                Latest
              </p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl uppercase text-brand-navy">
                Announcements
              </h2>
            </div>
            <Link
              href="/news"
              className="text-sm font-display font-bold uppercase tracking-wider text-brand-red hover:text-red-700 hidden sm:block"
            >
              All News →
            </Link>
          </div>

          {announcements && announcements.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {announcements.map((a) => (
                <article
                  key={a.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <p className="text-xs text-gray-400 font-display uppercase tracking-widest mb-2">
                    {a.published_at ? formatDate(a.published_at) : ""}
                  </p>
                  <h3 className="font-display font-bold text-brand-navy text-lg uppercase leading-tight mb-3">
                    {a.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {a.body}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No announcements yet — check back soon.</p>
          )}

          <div className="mt-6 sm:hidden">
            <Link
              href="/news"
              className="text-sm font-display font-bold uppercase tracking-wider text-brand-red"
            >
              All News →
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-brand-red font-display font-bold uppercase tracking-widest text-sm mb-1">
                Coming Up
              </p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl uppercase text-brand-navy">
                Events
              </h2>
            </div>
            <Link
              href="/events"
              className="text-sm font-display font-bold uppercase tracking-wider text-brand-red hover:text-red-700 hidden sm:block"
            >
              All Events →
            </Link>
          </div>

          {events && events.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => (
                <div
                  key={e.id}
                  className="bg-white rounded-lg overflow-hidden flex border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="w-2 bg-brand-red shrink-0" />
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-display font-bold text-brand-navy text-lg uppercase mb-2 leading-tight">
                      {e.name}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600 flex-1">
                      <p>{formatDateRange(e.start_date, e.end_date)}</p>
                      <p>{e.location}</p>
                      {e.age_groups && e.age_groups.length > 0 && (
                        <p>{e.age_groups.join(", ")}</p>
                      )}
                      <p className="font-semibold text-brand-navy">{formatPrice(e.price_cents)}</p>
                    </div>
                    <div className="mt-4">
                      {e.registration_open ? (
                        <Link
                          href={`/events/${e.id}/register`}
                          className="inline-block px-5 py-2 bg-brand-red text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-red-700 transition-colors"
                        >
                          Register Now
                        </Link>
                      ) : (
                        <Link
                          href="/events"
                          className="inline-block px-5 py-2 bg-gray-100 text-gray-400 text-xs font-display font-bold uppercase tracking-wider rounded"
                        >
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No upcoming events — check back soon.</p>
          )}

          <div className="mt-6 sm:hidden">
            <Link href="/events" className="text-sm font-display font-bold uppercase tracking-wider text-brand-red">
              All Events →
            </Link>
          </div>
        </div>
      </section>

      {/* Teams teaser */}
      <section className="py-16 bg-brand-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-red font-display font-bold uppercase tracking-widest text-sm mb-1">
            Our
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl uppercase mb-4">
            Teams
          </h2>
          <p className="text-blue-200 text-lg max-w-xl mx-auto mb-8">
            Competitive travel baseball for players ages 8U through 14U.
          </p>
          <Link
            href="/teams"
            className="inline-block px-8 py-3 border-2 border-white text-white font-display font-bold uppercase tracking-wider rounded hover:bg-white hover:text-brand-navy transition-colors text-sm"
          >
            View All Teams
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-red text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl uppercase mb-4">
            Ready to Join?
          </h2>
          <p className="text-red-100 text-lg mb-8">
            Tryouts are open. Find out which team is the right fit for your
            athlete.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/events"
              className="px-8 py-3 bg-white text-brand-red font-display font-bold uppercase tracking-wider rounded hover:bg-red-50 transition-colors text-sm"
            >
              Register Now
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border-2 border-white text-white font-display font-bold uppercase tracking-wider rounded hover:bg-red-700 transition-colors text-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
