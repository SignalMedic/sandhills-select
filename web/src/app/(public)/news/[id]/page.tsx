import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('announcements').select('title').eq('id', id).single()
  return { title: data ? `${data.title} — Sandhills Select Baseball` : 'Announcement' }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: a } = await supabase
    .from('announcements')
    .select('id, title, body, published_at, pinned, media_url')
    .eq('id', id)
    .eq('status', 'published')
    .single()

  if (!a) notFound()

  return (
    <>
      <div className="bg-brand-navy text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <Link
            href="/news"
            className="text-blue-300 text-xs font-display font-bold uppercase tracking-wider hover:text-white"
          >
            ← News
          </Link>
          {a.pinned && (
            <span className="ml-3 text-xs font-display font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-red text-white">
              Pinned
            </span>
          )}
          <h1 className="font-display font-bold text-3xl sm:text-4xl uppercase mt-4 mb-3 leading-tight">
            {a.title}
          </h1>
          {a.published_at && (
            <p className="text-blue-300 text-sm">{formatDate(a.published_at)}</p>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {a.media_url && (
          <img
            src={a.media_url}
            alt={a.title}
            className="w-full rounded-lg object-cover max-h-96 mb-8 border border-gray-100"
          />
        )}
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">{a.body}</p>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/news"
            className="text-xs font-display font-bold uppercase tracking-wider text-brand-red hover:underline"
          >
            ← Back to All Announcements
          </Link>
        </div>
      </div>
    </>
  )
}
