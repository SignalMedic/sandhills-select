import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = { title: "Registration Confirmed — Sandhills Select" };

export default async function RegistrationSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("id, name, price_cents")
    .eq("id", id)
    .single();

  if (!event) notFound();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        {/* Checkmark */}
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-display font-bold text-brand-navy text-3xl uppercase mb-3">
          You&apos;re Registered!
        </h1>
        <p className="text-gray-600 mb-2">
          Your registration for <span className="font-semibold text-brand-navy">{event.name}</span> has been received.
        </p>

        {event.price_cents > 0 ? (
          <p className="text-gray-500 text-sm mb-8">
            Payment instructions will be sent to the email address you provided. Your spot will be confirmed once payment is received.
          </p>
        ) : (
          <p className="text-gray-500 text-sm mb-8">
            A confirmation has been noted. We look forward to seeing you there!
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/events"
            className="px-6 py-2.5 bg-brand-navy text-white font-display font-bold uppercase tracking-wider text-sm rounded hover:bg-brand-navy-light transition-colors"
          >
            View All Events
          </Link>
          <Link
            href="/"
            className="px-6 py-2.5 border border-gray-300 text-gray-600 font-display font-bold uppercase tracking-wider text-sm rounded hover:border-gray-400 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
