import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import RegistrationForm from "./RegistrationForm";

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };
  if (s.toDateString() === e.toDateString()) return s.toLocaleDateString("en-US", opts);
  return `${s.toLocaleDateString("en-US", { month: "long", day: "numeric" })} – ${e.toLocaleDateString("en-US", opts)}`;
}

function formatPrice(cents: number) {
  if (cents === 0) return "Free";
  return `$${(cents / 100).toFixed(0)}`;
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("id, name, location, start_date, end_date, age_groups, price_cents, waiver_text, registration_open, max_registrations")
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (!event) notFound();

  if (!event.registration_open) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="font-display font-bold text-brand-navy text-2xl uppercase mb-3">Registration Closed</p>
        <p className="text-gray-500 mb-6">Registration for this event is currently closed.</p>
        <Link href="/events" className="text-brand-red font-display font-bold uppercase text-sm hover:underline">← Back to Events</Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-brand-navy text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Link href="/events" className="text-blue-300 text-xs font-display font-bold uppercase tracking-wider hover:text-white">
            ← Events
          </Link>
          <h1 className="font-display font-bold text-3xl sm:text-4xl uppercase mt-3 mb-2">{event.name}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-blue-200 text-sm mt-3">
            <span>{formatDateRange(event.start_date, event.end_date)}</span>
            <span>{event.location}</span>
            {event.age_groups && event.age_groups.length > 0 && (
              <span>{event.age_groups.join(", ")}</span>
            )}
            <span className="font-bold text-white">{formatPrice(event.price_cents)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="font-display font-bold text-brand-navy text-2xl uppercase mb-8">Register</h2>
        <RegistrationForm event={event} />
      </div>
    </>
  );
}
