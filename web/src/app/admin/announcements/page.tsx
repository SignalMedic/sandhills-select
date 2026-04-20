import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Announcements — Admin' }

export default async function AnnouncementsPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: announcements } = await supabase
    .from('announcements')
    .select('id, title, status, published_at, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-brand-navy text-3xl uppercase">Announcements</h1>
          <p className="text-gray-500 mt-1">{announcements?.length ?? 0} total</p>
        </div>
        <Link
          href="/admin/announcements/new"
          className="px-4 py-2 bg-brand-red text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-red-700 transition-colors"
        >
          + New
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        {!announcements?.length ? (
          <p className="p-8 text-center text-gray-400 text-sm">No announcements yet.</p>
        ) : (
          announcements.map((a) => (
            <div key={a.id} className="flex items-start justify-between px-4 py-4 gap-2">
              <div>
                <p className="font-semibold text-brand-navy text-sm">{a.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {a.status === 'published' && a.published_at
                    ? `Published ${new Date(a.published_at).toLocaleDateString()}`
                    : `Draft · Created ${new Date(a.created_at).toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-display font-bold uppercase px-2 py-0.5 rounded ${
                    a.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {a.status}
                </span>
                <Link
                  href={`/admin/announcements/${a.id}`}
                  className="text-xs font-display font-bold uppercase text-brand-navy hover:text-brand-red"
                >
                  Edit →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
