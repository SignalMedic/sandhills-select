import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Suspense } from 'react'
import FiltersBar from './FiltersBar'

export const metadata = { title: 'Reimbursements — Admin' }

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  paid: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-800',
}

type Receipt = { amount_cents: number; expense_categories: { name: string } | null }

export default async function ReimbursementsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; team_id?: string; date_from?: string; date_to?: string }>
}) {
  await requireAdmin()
  const supabase = await createClient()
  const { status, team_id, date_from, date_to } = await searchParams
  const activeStatus = status ?? 'under_review'

  let reqQuery = supabase
    .from('reimbursement_requests')
    .select(
      'id, title, status, created_at, team_id, profiles!coach_id(full_name), teams(name), receipts(amount_cents, expense_categories(name))'
    )
    .order('created_at', { ascending: false })

  if (activeStatus !== 'all') reqQuery = reqQuery.eq('status', activeStatus)
  if (team_id) reqQuery = reqQuery.eq('team_id', team_id)
  if (date_from) reqQuery = reqQuery.gte('created_at', date_from)
  if (date_to) reqQuery = reqQuery.lte('created_at', `${date_to}T23:59:59`)

  const [{ data: teams }, { data: rawRequests }] = await Promise.all([
    supabase.from('teams').select('id, name').eq('active', true).order('name'),
    reqQuery,
  ])

  const requests = rawRequests ?? []

  const getTotal = (r: (typeof requests)[number]) =>
    (r.receipts as unknown as Receipt[]).reduce((s, x) => s + x.amount_cents, 0)

  const totalCents = requests.reduce((s, r) => s + getTotal(r), 0)
  const approvedCents = requests
    .filter((r) => r.status === 'approved')
    .reduce((s, r) => s + getTotal(r), 0)
  const paidCents = requests
    .filter((r) => r.status === 'paid')
    .reduce((s, r) => s + getTotal(r), 0)

  // Team breakdown
  const teamMap = new Map<string, { name: string; count: number; cents: number }>()
  for (const r of requests) {
    const key = r.team_id as string
    const name = (r.teams as unknown as { name: string } | null)?.name ?? 'Unknown'
    const cents = getTotal(r)
    const prev = teamMap.get(key) ?? { name, count: 0, cents: 0 }
    teamMap.set(key, { name, count: prev.count + 1, cents: prev.cents + cents })
  }
  const teamBreakdown = Array.from(teamMap.values()).sort((a, b) => b.cents - a.cents)

  // Category breakdown
  const catMap = new Map<string, { count: number; cents: number }>()
  for (const r of requests) {
    for (const rec of r.receipts as unknown as Receipt[]) {
      const cat = rec.expense_categories?.name ?? 'Uncategorized'
      const prev = catMap.get(cat) ?? { count: 0, cents: 0 }
      catMap.set(cat, { count: prev.count + 1, cents: prev.cents + rec.amount_cents })
    }
  }
  const categoryBreakdown = Array.from(catMap.entries())
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.cents - a.cents)

  const exportParams = new URLSearchParams()
  if (activeStatus !== 'all') exportParams.set('status', activeStatus)
  if (team_id) exportParams.set('team_id', team_id)
  if (date_from) exportParams.set('date_from', date_from)
  if (date_to) exportParams.set('date_to', date_to)

  return (
    <div className="p-4 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-brand-navy text-3xl uppercase">Reimbursements</h1>
        <a
          href={`/admin/reimbursements/export?${exportParams.toString()}`}
          className="px-3 py-1.5 text-xs font-display font-bold uppercase tracking-wider bg-white border border-gray-200 text-brand-navy rounded hover:bg-gray-50 transition-colors"
        >
          Export ZIP ↓
        </a>
      </div>

      <Suspense>
        <FiltersBar teams={teams ?? []} />
      </Suspense>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Requests', value: requests.length.toString() },
          { label: 'Total', value: `$${(totalCents / 100).toFixed(2)}` },
          { label: 'Approved', value: `$${(approvedCents / 100).toFixed(2)}` },
          { label: 'Paid', value: `$${(paidCents / 100).toFixed(2)}` },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg px-4 py-3">
            <p className="text-2xl font-display font-bold text-brand-navy">{s.value}</p>
            <p className="text-xs text-gray-400 font-display font-bold uppercase tracking-wider mt-0.5">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Breakdown tables */}
      {requests.length > 0 && (teamBreakdown.length > 1 || categoryBreakdown.length > 0) && (
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          {teamBreakdown.length > 1 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h2 className="font-display font-bold text-brand-navy text-xs uppercase tracking-wider mb-3">
                By Team
              </h2>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-400 font-display uppercase tracking-wider">
                    <th className="text-left pb-2 font-bold">Team</th>
                    <th className="text-right pb-2 font-bold">Requests</th>
                    <th className="text-right pb-2 font-bold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {teamBreakdown.map((t) => (
                    <tr key={t.name}>
                      <td className="py-1.5 text-brand-navy font-medium">{t.name}</td>
                      <td className="py-1.5 text-right text-gray-500">{t.count}</td>
                      <td className="py-1.5 text-right font-bold text-brand-navy">
                        ${(t.cents / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {categoryBreakdown.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h2 className="font-display font-bold text-brand-navy text-xs uppercase tracking-wider mb-3">
                By Category
              </h2>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-400 font-display uppercase tracking-wider">
                    <th className="text-left pb-2 font-bold">Category</th>
                    <th className="text-right pb-2 font-bold">Receipts</th>
                    <th className="text-right pb-2 font-bold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categoryBreakdown.map((c) => (
                    <tr key={c.name}>
                      <td className="py-1.5 text-brand-navy font-medium">{c.name}</td>
                      <td className="py-1.5 text-right text-gray-500">{c.count}</td>
                      <td className="py-1.5 text-right font-bold text-brand-navy">
                        ${(c.cents / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Request list */}
      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        {!requests.length ? (
          <p className="p-8 text-center text-gray-400 text-sm">No requests.</p>
        ) : (
          requests.map((r) => {
            const rowTotal = getTotal(r)
            return (
              <div key={r.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-semibold text-brand-navy text-sm">{r.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {((r as Record<string, unknown>)['profiles'] as { full_name: string } | null)?.full_name} ·{' '}
                    {(r.teams as unknown as { name: string } | null)?.name} ·{' '}
                    ${(rowTotal / 100).toFixed(2)} ·{' '}
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-display font-bold uppercase px-2 py-0.5 rounded ${statusColor[r.status] ?? ''}`}
                  >
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
            )
          })
        )}
      </div>
    </div>
  )
}
