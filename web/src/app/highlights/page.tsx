import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import Image from "next/image";

export const metadata = { title: "Highlights — Sandhills Select Baseball" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function HighlightsPage() {
  const supabase = await createClient();

  const { data: highlights } = await supabase
    .from("highlights")
    .select("*, teams(name), profiles(full_name)")
    .eq("status", "approved")
    .order("approved_at", { ascending: false });

  return (
    <>
      <PageHeader
        eyebrow="On the Field"
        title="Highlights"
        subtitle="Photos, videos, and moments from our teams."
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!highlights || highlights.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <p className="font-display uppercase tracking-widest text-lg">
                Highlights coming soon
              </p>
              <p className="text-sm mt-2">
                Coaches will be posting photos and updates here.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {highlights.map((h) => (
                <div
                  key={h.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {h.media_url && h.type === "photo" && (
                    <div className="aspect-video relative bg-gray-100">
                      <Image
                        src={h.media_url}
                        alt={h.caption}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  {h.media_url && h.type === "video" && (
                    <div className="aspect-video bg-brand-navy flex items-center justify-center">
                      <video
                        src={h.media_url}
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {h.type === "text" && (
                    <div className="bg-brand-navy aspect-video flex items-center justify-center p-6">
                      <span className="font-display font-bold text-white text-5xl">
                        SS
                      </span>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-display font-bold uppercase tracking-widest text-brand-red">
                        {h.teams?.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {h.approved_at ? formatDate(h.approved_at) : ""}
                      </span>
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed">
                      {h.caption}
                    </p>
                    {h.profiles?.full_name && (
                      <p className="text-xs text-gray-400 mt-2">
                        Posted by {h.profiles.full_name}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
