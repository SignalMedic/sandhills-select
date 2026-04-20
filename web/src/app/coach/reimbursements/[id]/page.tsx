import { requireCoach } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DeleteButton from '@/components/DeleteButton'
import AddReceiptForm from './AddReceiptForm'
import { addReceipt, removeReceipt, submitReimbursementRequest } from '../actions'

export const metadata = { title: 'Reimbursement Request — Coach Portal' }

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  paid: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-800',
}

export default async function CoachReimbursementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const profile = await requireCoach()
  const { id } = await params
  const supabase = await createClient()

  const [{ data: req }, { data: receipts }, { data: categories }] = await Promise.all([
    supabase
      .from('reimbursement_requests')
      .select('*, teams(name)')
      .eq('id', id)
      .eq('coach_id', profile.id)
      .single(),
    supabase
      .from('receipts')
      .select('*, expense_categories(name)')
      .eq('reimbursement_request_id', id)
      .order('expense_date'),
    supabase.from('expense_categories').select('id, name').order('name'),
  ])

  if (!req) notFound()

  const team = req.teams as unknown as { name: string } | null
  const isPending = req.status === 'pending'

  const boundAddReceipt = addReceipt.bind(null, id)
  const submitAction = submitReimbursementRequest.bind(null, id)

  return (
    <div className="p-8 max-w-2xl space-y-8">
      <div className="flex items-center gap-3">
        <Link
          href="/coach/reimbursements"
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
        <div className="mt-2 flex gap-4 text-sm text-gray-500">
          <span>{team?.name}</span>
          <span>{new Date(req.created_at).toLocaleDateString()}</span>
        </div>
        {req.notes && <p className="mt-2 text-sm text-gray-600">{req.notes}</p>}
        {req.denial_reason && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded px-4 py-3">
            <p className="text-xs font-bold uppercase text-red-600 mb-1">Denial Reason</p>
            <p className="text-sm text-red-700">{req.denial_reason}</p>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-brand-navy text-xl uppercase">
            Receipts ({receipts?.length ?? 0})
          </h2>
          <p className="font-display font-bold text-brand-navy text-lg">
            Total: ${((req.total_amount_cents ?? 0) / 100).toFixed(2)}
          </p>
        </div>

        {receipts && receipts.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100 mb-4">
            {receipts.map((r) => {
              const removeAction = removeReceipt.bind(null, id, r.id)
              return (
                <div key={r.id} className="flex items-center justify-between px-5 py-3 gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-brand-navy">
                      {r.merchant_name ?? 'Unknown Merchant'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(r.expense_categories as unknown as { name: string } | null)?.name} · {new Date(r.expense_date).toLocaleDateString()}
                    </p>
                    {r.notes && <p className="text-xs text-gray-500 mt-0.5">{r.notes}</p>}
                  </div>
                  <p className="text-sm font-bold text-brand-navy shrink-0">
                    ${(r.amount_cents / 100).toFixed(2)}
                  </p>
                  {isPending && (
                    <DeleteButton action={removeAction} label="Remove" confirmMessage="Remove this receipt?" />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {isPending && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <p className="text-xs font-display font-bold uppercase tracking-wider text-gray-500 mb-4">
              Add Receipt
            </p>
            <AddReceiptForm action={boundAddReceipt} categories={categories ?? []} />
          </div>
        )}
      </div>

      {isPending && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="font-display font-bold text-brand-navy text-lg uppercase mb-2">Submit for Review</h2>
          <p className="text-sm text-gray-500 mb-4">
            Once submitted, you cannot add or remove receipts. An admin will review and approve or deny.
          </p>
          <form action={submitAction}>
            <button
              type="submit"
              disabled={(req.total_amount_cents ?? 0) === 0}
              className="px-6 py-2 bg-brand-red text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit Request
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
