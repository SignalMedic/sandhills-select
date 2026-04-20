import Link from "next/link";
import Image from "next/image";

const announcements = [
  {
    id: 1,
    date: "April 18, 2026",
    title: "Spring Season Tryouts Now Open",
    excerpt:
      "Registration is open for all age groups. Tryouts will be held at Pinehurst Regional Park on May 3rd and 4th.",
  },
  {
    id: 2,
    date: "April 12, 2026",
    title: "Tournament Results — Moore County Classic",
    excerpt:
      "Our 12U squad went 4-1 and took home the championship. Huge effort from the whole team. Full recap inside.",
  },
  {
    id: 3,
    date: "April 5, 2026",
    title: "Welcome to the New Website",
    excerpt:
      "We've launched a new home for Sandhills Select. Schedules, events, and highlights all in one place.",
  },
];

const upcomingEvents = [
  {
    id: 1,
    name: "Spring Kickoff Tournament",
    date: "May 10–11, 2026",
    location: "Pinehurst Regional Park",
    age: "10U / 12U / 14U",
  },
  {
    id: 2,
    name: "Summer Showcase",
    date: "June 21–22, 2026",
    location: "Moore County Complex",
    age: "All Ages",
  },
];

const teams = [
  { name: "8U Red", coach: "Coach Williams" },
  { name: "10U Navy", coach: "Coach Davis" },
  { name: "12U Select", coach: "Coach Thompson" },
  { name: "14U Elite", coach: "Coach Martinez" },
];

export default function HomePage() {
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {announcements.map((a) => (
              <article
                key={a.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <p className="text-xs text-gray-400 font-display uppercase tracking-widest mb-2">
                  {a.date}
                </p>
                <h3 className="font-display font-bold text-brand-navy text-lg uppercase leading-tight mb-3">
                  {a.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {a.excerpt}
                </p>
              </article>
            ))}
          </div>
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
      <section className="py-16 bg-brand-gray">
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
          <div className="grid gap-6 sm:grid-cols-2">
            {upcomingEvents.map((e) => (
              <div
                key={e.id}
                className="bg-white rounded-lg overflow-hidden flex border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="w-2 bg-brand-red shrink-0" />
                <div className="p-6 flex-1">
                  <h3 className="font-display font-bold text-brand-navy text-xl uppercase mb-3">
                    {e.name}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-semibold text-gray-800">
                        Date:
                      </span>{" "}
                      {e.date}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">
                        Location:
                      </span>{" "}
                      {e.location}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">
                        Age Groups:
                      </span>{" "}
                      {e.age}
                    </p>
                  </div>
                  <Link
                    href="/events"
                    className="mt-4 inline-block px-5 py-2 bg-brand-red text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-red-700 transition-colors"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teams */}
      <section className="py-16 bg-brand-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-brand-red font-display font-bold uppercase tracking-widest text-sm mb-1">
              Our
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl uppercase">
              Teams
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {teams.map((team) => (
              <Link
                key={team.name}
                href="/teams"
                className="group border border-brand-navy-light rounded-lg p-6 text-center hover:border-brand-red hover:bg-brand-navy-light transition-all"
              >
                <Image
                  src="/logo.png"
                  alt="Sandhills Select"
                  width={48}
                  height={48}
                  className="rounded mx-auto mb-4"
                />
                <h3 className="font-display font-bold uppercase tracking-wide text-base mb-1">
                  {team.name}
                </h3>
                <p className="text-blue-300 text-xs">{team.coach}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/teams"
              className="inline-block px-8 py-3 border-2 border-white text-white font-display font-bold uppercase tracking-wider rounded hover:bg-white hover:text-brand-navy transition-colors text-sm"
            >
              View All Teams
            </Link>
          </div>
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
