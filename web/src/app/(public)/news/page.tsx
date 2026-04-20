import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "News — Sandhills Select Baseball" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function NewsPage() {
  const supabase = await createClient();

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*, profiles(full_name)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <>
      <PageHeader
        eyebrow="Stay Informed"
        title="News &amp; Announcements"
        subtitle="Updates from the Sandhills Select organization."
      />

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {!announcements || announcements.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <p className="font-display uppercase tracking-widest text-lg">
                No announcements yet
              </p>
              <p className="text-sm mt-2">Check back soon.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {announcements.map((a) => (
                <article key={a.id} className="py-10 first:pt-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-display font-bold uppercase tracking-widest text-brand-red">
                      {a.published_at ? formatDate(a.published_at) : ""}
                    </span>
                    {a.profiles?.full_name && (
                      <>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs text-gray-400">
                          {a.profiles.full_name}
                        </span>
                      </>
                    )}
                  </div>
                  <h2 className="font-display font-bold text-brand-navy text-2xl uppercase leading-tight mb-4">
                    {a.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {a.body}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
