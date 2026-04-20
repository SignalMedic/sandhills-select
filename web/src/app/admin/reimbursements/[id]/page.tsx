import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import StatusForm from './StatusForm'
import { updateReimbursementStatus } from '../actions'

export const metadata = { title: 'Review Reimbursement — Admin' }

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  paid: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-800',
}

export default async function ReimbursementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const supabase = await createClient()

  const [{ data: req }, { data: receipts }, { data: categories }] = await Promise.all([
    supabase
      .from('reimbursement_requests')
      .select('*, profiles!coach_id(full_name, email), teams(name)')
      .eq('id', id)
      .single(),
    supabase
      .from('receipts')
      .select('*, expense_categories(name)')
      .eq('reimbursement_request_id', id)
      .order('expense_date'),
    supabase.from('expense_categories').select('id, name'),
  ])

  if (!req) notFound()

  const coach = (req as Record<string, unknown>)['profiles'] as { full_name: string; email: string } | null
  const team = req.teams as { name: string } | null
  const boundUpdate = updateReimbursementStatus.bind(null, id)

  return (
    <div className="p-8 space-y-8 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/reimbursements"
          className="text-xs font-display font-bold uppercase text-gray-400 hover:text-brand-navy"
        >
          ← Reimbursements
        </Link>
        <span className={`text-xs font-display font-bold uppercase px-2 py-0.5 rounded ${statusColor[req.status] ?? ''}`}>
          {req.status.replace('_', ' ')}
        </span>
      </div>

      <div>
        <h1 className="font-display font-bold text-brand-navy text-3xl uppercase">{req.title}</h1>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Coach</p>
            <p className="text-brand-navy">{coach?.full_name}</p>
            <p className="text-gray-500 text-xs">{coach?.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Team</p>
            <p className="text-brand-navy">{team?.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Total</p>
            <p className="text-brand-navy font-bold">${((receipts ?? []).reduce((sum, r) => sum + r.amount_cents, 0) / 100).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Submitted</p>
            <p className="text-brand-navy">{new Date(req.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        {req.notes && (
          <div className="mt-3">
            <p className="text-xs text-gray-400 uppercase font-bold">Notes</p>
            <p className="text-sm text-gray-700 mt-1">{req.notes}</p>
          </div>
        )}
        {req.denial_reason && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded px-4 py-3">
            <p className="text-xs font-bold uppercase text-red-600 mb-1">Denial Reason</p>
            <p className="text-sm text-red-700">{req.denial_reason}</p>
          </div>
        )}
      </div>

      <div>
        <h2 className="font-display font-bold text-brand-navy text-xl uppercase mb-3">
          Receipts ({receipts?.length ?? 0})
        </h2>
        {receipts && receipts.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
            {receipts.map((r) => (
              <div key={r.id} className="px-5 py-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-brand-navy">
                      {r.merchant_name ?? 'Unknown Merchant'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {(r.expense_categories as { name: string } | null)?.name} ·{' '}
                      {new Date(r.expense_date).toLocaleDateString()}
                    </p>
                    {r.notes && <p className="text-xs text-gray-500 mt-1">{r.notes}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-brand-navy">${(r.amount_cents / 100).toFixed(2)}</p>
                    {r.image_url && (
                      <a
                        href={r.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand-red hover:underline"
                      >
                        {r.image_url.endsWith('.pdf') ? 'View PDF' : 'View full size'}
                      </a>
                    )}
                  </div>
                </div>
                {r.image_url && !r.image_url.endsWith('.pdf') && (
                  <a href={r.image_url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={r.image_url}
                      alt={`Receipt — ${r.merchant_name ?? 'unknown'}`}
                      className="rounded border border-gray-200 max-h-48 object-contain hover:opacity-90 transition-opacity"
                    />
                  </a>
                )}
                {r.image_url && r.image_url.endsWith('.pdf') && (
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded px-3 py-2 w-fit">
                    <span className="text-xs text-gray-500">PDF</span>
                    <a
                      href={r.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-display font-bold uppercase text-brand-red hover:underline"
                    >
                      Open →
                    </a>
                  </div>
                )}
              </div>
            ))}
            <div className="px-5 py-3 bg-gray-50 flex justify-end">
              <p className="text-sm font-bold text-brand-navy">
                Total: ${((receipts ?? []).reduce((sum, r) => sum + r.amount_cents, 0) / 100).toFixed(2)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400">No receipts attached.</p>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="font-display font-bold text-brand-navy text-xl uppercase mb-4">Update Status</h2>
        <StatusForm action={boundUpdate} currentStatus={req.status} />
      </div>
    </div>
  )
}
