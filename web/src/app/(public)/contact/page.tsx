import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import ContactForm from "./ContactForm";

export const metadata = { title: "Contact — Sandhills Select Baseball" };

export default async function ContactPage() {
  const supabase = await createClient();

  const { data: teams } = await supabase
    .from("teams")
    .select("id, name, age_group")
    .eq("active", true)
    .order("age_group");

  return (
    <>
      <PageHeader
        eyebrow="Get in Touch"
        title="Contact Us"
        subtitle="Reach out to the organization or a specific team's coaching staff."
      />

      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm teams={teams ?? []} />
        </div>
      </section>
    </>
  );
}
