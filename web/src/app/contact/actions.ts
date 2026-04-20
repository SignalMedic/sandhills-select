"use server";

import { createClient } from "@/lib/supabase/server";

type FormState = { success: boolean; error?: string } | null;

export async function submitContactForm(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const senderName = formData.get("sender_name") as string;
  const senderEmail = formData.get("sender_email") as string;
  const subject = formData.get("subject") as string;
  const body = formData.get("body") as string;
  const recipientType = formData.get("recipient_type") as "team" | "admin";
  const teamId = formData.get("team_id") as string | null;

  if (!senderName || !senderEmail || !subject || !body) {
    return { success: false, error: "All fields are required." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("messages").insert({
    sender_name: senderName,
    sender_email: senderEmail,
    subject,
    body,
    recipient_type: recipientType,
    team_id: recipientType === "team" && teamId ? teamId : null,
  });

  if (error) {
    return { success: false, error: "Failed to send message. Please try again." };
  }

  return { success: true };
}
