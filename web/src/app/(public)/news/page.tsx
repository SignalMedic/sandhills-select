import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/PageHeader'
import Link from 'next/link'

export const metadata = { title: 'News — Sandhills Select Baseball' }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function NewsPage() {
  const supabase = await createClient()

  const { data: announcements } = await supabase
    .from('announcements')
    .select('id, title, body, published_at, pinned')
    .eq('status', 'published')
    .order('pinned', { ascending: false })
    .order('published_at', { ascending: false })

  const pinned = (announcements ?? []).filter((a) => a.pinned)
  const rest = (announcements ?? []).filter((a) => !a.pinned)

  return (
    <>
      <PageHeader
        eyebrow="Organization News"
        title="Announcements"
        subtitle="Updates, reminders, and news from Sandhills Select Baseball."
      />

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {!announcements?.length ? (
            <div className="text-center py-24 text-gray-400">
              <p className="font-display uppercase tracking-widest text-lg">No announcements yet</p>
              <p className="text-sm mt-2">Check back soon.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {pinned.length > 0 && (
                <div className="space-y-4">
                  {pinned.map((a) => (
                    <Link key={a.id} href={`/news/${a.id}`} className="block group">
                      <article className="border-2 border-brand-navy rounded-lg p-8 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-display font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-navy text-white">
                            Pinned
                          </span>
                          {a.published_at && (
                            <span className="text-xs text-gray-400 font-display uppercase tracking-widest">
                              {formatDate(a.published_at)}
                            </span>
                          )}
                        </div>
                        <h2 className="font-display font-bold text-brand-navy text-2xl uppercase leading-tight mb-3 group-hover:text-brand-red transition-colors">
                          {a.title}
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{a.body}</p>
                        <p className="mt-4 text-xs font-display font-bold uppercase tracking-wider text-brand-red">
                          Read More →
                        </p>
                      </article>
                    </Link>
                  ))}
                </div>
              )}

              {rest.length > 0 && (
                <div className="space-y-4">
                  {pinned.length > 0 && (
                    <h3 className="font-display font-bold text-gray-400 text-sm uppercase tracking-widest border-b border-gray-100 pb-3">
                      All Announcements
                    </h3>
                  )}
                  {rest.map((a) => (
                    <Link key={a.id} href={`/news/${a.id}`} className="block group">
                      <article className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        {a.published_at && (
                          <p className="text-xs text-gray-400 font-display uppercase tracking-widest mb-2">
                            {formatDate(a.published_at)}
                          </p>
                        )}
                        <h2 className="font-display font-bold text-brand-navy text-xl uppercase leading-tight mb-2 group-hover:text-brand-red transition-colors">
                          {a.title}
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{a.body}</p>
                        <p className="mt-3 text-xs font-display font-bold uppercase tracking-wider text-brand-red">
                          Read More →
                        </p>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
