import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Highlights — Admin' }

const STATUS_TABS = ['pending', 'approved', 'rejected'] as const
type StatusTab = (typeof STATUS_TABS)[number]

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

export default async function HighlightsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  await requireAdmin()
  const supabase = await createClient()
  const { status } = await searchParams
  const activeTab = (STATUS_TABS.includes(status as StatusTab) ? status : 'pending') as StatusTab

  const { data: highlights } = await supabase
    .from('highlights')
    .select('id, caption, type, status, created_at, profiles!coach_id(full_name), teams(name)')
    .eq('status', activeTab)
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-brand-navy text-3xl uppercase">Highlights</h1>
      </div>

      <div className="flex flex-wrap gap-1 mb-6">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab}
            href={`/admin/highlights?status=${tab}`}
            className={`px-3 py-1.5 text-xs font-display font-bold uppercase tracking-wider rounded transition-colors ${
              activeTab === tab
                ? 'bg-brand-navy text-white'
                : 'bg-white border border-gray-200 text-gray-500 hover:text-brand-navy'
            }`}
          >
            {tab}
          </Link>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {!highlights?.length ? (
          <p className="p-8 text-center text-gray-400 text-sm">No {activeTab} highlights.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {highlights.map((h) => {
              const coach = (h as Record<string, unknown>)['profiles'] as { full_name: string } | null
              const team = h.teams as unknown as { name: string } | null
              return (
                <Link
                  key={h.id}
                  href={`/admin/highlights/${h.id}`}
                  className="flex items-start justify-between px-4 py-4 gap-2 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brand-navy truncate">{h.caption || '(no caption)'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {coach?.full_name} · {team?.name} · <span className="capitalize">{h.type}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs font-display font-bold uppercase px-2 py-0.5 rounded ${statusColor[h.status] ?? ''}`}>
                      {h.status}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(h.created_at).toLocaleDateString()}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
