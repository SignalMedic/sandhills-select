"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function setPassword(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;

  if (password !== confirm) return "Passwords do not match.";
  if (password.length < 8) return "Password must be at least 8 characters.";

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return error.message;

  // Role-based redirect after password is set
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role;
  if (role === "admin" || role === "super_admin") redirect("/admin");
  redirect("/coach");
}
