import { requireCoach } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Reimbursements — Coach Portal' }

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  paid: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-800',
}

export default async function CoachReimbursementsPage() {
  const profile = await requireCoach()
  const supabase = await createClient()

  const { data: requests } = await supabase
    .from('reimbursement_requests')
    .select('id, title, status, total_amount_cents, created_at, teams(name)')
    .eq('coach_id', profile.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-brand-navy text-3xl uppercase">Reimbursements</h1>
          <p className="text-gray-500 mt-1">{requests?.length ?? 0} total</p>
        </div>
        <Link
          href="/coach/receipts/new"
          className="px-4 py-2 bg-brand-red text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-red-700 transition-colors"
        >
          + New Request
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        {!requests?.length ? (
          <div className="p-8 text-center">
            <p className="text-gray-400 text-sm mb-3">No reimbursement requests yet.</p>
            <Link
              href="/coach/receipts/new"
              className="text-xs font-display font-bold uppercase text-brand-red"
            >
              Submit your first receipt →
            </Link>
          </div>
        ) : (
          requests.map((r) => (
            <div key={r.id} className="flex items-start justify-between px-4 py-4 gap-2">
              <div>
                <p className="font-semibold text-brand-navy text-sm">{r.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
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
                  href={`/coach/reimbursements/${r.id}`}
                  className="text-xs font-display font-bold uppercase text-brand-navy hover:text-brand-red"
                >
                  {r.status === 'pending' ? 'Edit →' : 'View →'}
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
