import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Reimbursements — Admin' }

const STATUS_TABS = ['all', 'pending', 'under_review', 'approved', 'paid', 'denied'] as const
type StatusTab = (typeof STATUS_TABS)[number]

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  paid: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-800',
}

export default async function ReimbursementsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  await requireAdmin()
  const supabase = await createClient()
  const { status } = await searchParams
  const activeTab = (STATUS_TABS.includes(status as StatusTab) ? status : 'pending') as StatusTab

  let query = supabase
    .from('reimbursement_requests')
    .select('id, title, status, total_amount_cents, created_at, profiles(full_name), teams(name)')
    .order('created_at', { ascending: false })

  if (activeTab !== 'all') {
    query = query.eq('status', activeTab)
  }

  const { data: requests } = await query

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-brand-navy text-3xl uppercase">Reimbursements</h1>
      </div>

      <div className="flex flex-wrap gap-1 mb-6">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab}
            href={`/admin/reimbursements?status=${tab}`}
            className={`px-3 py-1.5 text-xs font-display font-bold uppercase tracking-wider rounded transition-colors ${
              activeTab === tab
                ? 'bg-brand-navy text-white'
                : 'bg-white border border-gray-200 text-gray-500 hover:text-brand-navy'
            }`}
          >
            {tab.replace('_', ' ')}
          </Link>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        {!requests?.length ? (
          <p className="p-8 text-center text-gray-400 text-sm">No requests.</p>
        ) : (
          requests.map((r) => (
            <div key={r.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-semibold text-brand-navy text-sm">{r.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {(r.profiles as unknown as { full_name: string } | null)?.full_name} ·{' '}
                  {(r.teams as unknown as { name: string } | null)?.name} ·{' '}
                  ${((r.total_amount_cents ?? 0) / 100).toFixed(2)} ·{' '}
                  {new Date(r.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-display font-bold uppercase px-2 py-0.5 rounded ${statusColor[r.status] ?? ''}`}>
                  {r.status.replace('_', ' ')}
                </span>
                <Link
                  href={`/admin/reimbursements/${r.id}`}
                  className="text-xs font-display font-bold uppercase text-brand-navy hover:text-brand-red"
                >
                  Review →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
