"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function submitRegistration(
  eventId: string,
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const supabase = await createClient();

  // Verify event is still open
  const { data: event } = await supabase
    .from("events")
    .select("id, name, registration_open, max_registrations, price_cents, waiver_text")
    .eq("id", eventId)
    .eq("status", "published")
    .single();

  if (!event) return "This event is no longer available.";
  if (!event.registration_open) return "Registration for this event is closed.";

  // Check capacity
  if (event.max_registrations) {
    const { count } = await supabase
      .from("event_registrations")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId);
    if ((count ?? 0) >= event.max_registrations) {
      return "This event is full.";
    }
  }

  // Validate waiver if required
  const waiverAccepted = formData.get("waiver_accepted") === "on";
  const waiverSignature = (formData.get("waiver_signature") as string).trim();
  if (event.waiver_text) {
    if (!waiverAccepted) return "You must accept the waiver to register.";
    if (!waiverSignature) return "Please type your full name to sign the waiver.";
  }

  const playerName = (formData.get("player_name") as string).trim();
  const registrantName = (formData.get("registrant_name") as string).trim();
  const registrantEmail = (formData.get("registrant_email") as string).trim().toLowerCase();

  if (!playerName) return "Player name is required.";
  if (!registrantName) return "Parent/guardian name is required.";
  if (!registrantEmail) return "Email address is required.";

  const dobRaw = formData.get("player_dob") as string;
  const { error } = await supabase.from("event_registrations").insert({
    event_id: eventId,
    player_name: playerName,
    player_dob: dobRaw || null,
    position: (formData.get("position") as string).trim() || null,
    age_group: (formData.get("age_group") as string).trim() || null,
    registrant_name: registrantName,
    registrant_email: registrantEmail,
    registrant_phone: (formData.get("registrant_phone") as string).trim() || null,
    waiver_accepted: waiverAccepted,
    waiver_signature: waiverSignature || null,
    notes: (formData.get("notes") as string).trim() || null,
    payment_status: event.price_cents === 0 ? "paid" : "pending",
    amount_paid_cents: 0,
  });

  if (error) return error.message;

  redirect(`/events/${eventId}/register/success`);
}
