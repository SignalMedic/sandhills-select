import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Events — Admin' }

export default async function EventsPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: events } = await supabase
    .from('events')
    .select('id, name, location, start_date, end_date, status, registration_open, price_cents, event_registrations(count)')
    .order('start_date', { ascending: false })

  return (
    <div className="p-4 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-brand-navy text-3xl uppercase">Events</h1>
          <p className="text-gray-500 mt-1">{events?.length ?? 0} total</p>
        </div>
        <Link
          href="/admin/events/new"
          className="px-4 py-2 bg-brand-red text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-red-700 transition-colors"
        >
          + New
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        {!events?.length ? (
          <p className="p-8 text-center text-gray-400 text-sm">No events yet.</p>
        ) : (
          events.map((e) => (
            <div key={e.id} className="flex items-start justify-between px-4 py-4 gap-2">
              <div>
                <p className="font-semibold text-brand-navy text-sm">{e.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(e.start_date).toLocaleDateString()} · {e.location}
                  {e.price_cents > 0 && ` · $${(e.price_cents / 100).toFixed(2)}`}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {(() => {
                  const count = (e.event_registrations as { count: number }[] | null)?.[0]?.count ?? 0
                  return count > 0 ? (
                    <span className="text-xs font-display font-bold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                      {count} registered
                    </span>
                  ) : null
                })()}
                <span
                  className={`text-xs font-display font-bold uppercase px-2 py-0.5 rounded ${
                    e.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {e.status}
                </span>
                {e.registration_open && (
                  <span className="text-xs font-display font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Reg Open
                  </span>
                )}
                <Link
                  href={`/admin/events/${e.id}`}
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
