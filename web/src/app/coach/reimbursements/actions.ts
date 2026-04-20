'use server'

import { requireCoach } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createReimbursementRequest(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const profile = await requireCoach()
  const supabase = await createClient()

  const teamId = formData.get('team_id') as string
  const title = formData.get('title') as string
  const notes = (formData.get('notes') as string) || null

  const { data, error } = await supabase
    .from('reimbursement_requests')
    .insert({ coach_id: profile.id, team_id: teamId, title, notes })
    .select('id')
    .single()

  if (error) return error.message
  revalidatePath('/coach/reimbursements')
  redirect(`/coach/reimbursements/${data.id}`)
}

export async function addReceipt(
  requestId: string,
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const profile = await requireCoach()
  const supabase = await createClient()

  const { data: req } = await supabase
    .from('reimbursement_requests')
    .select('coach_id, status')
    .eq('id', requestId)
    .single()

  if (!req || req.coach_id !== profile.id) return 'Not authorized.'
  if (req.status !== 'pending') return 'Cannot add receipts after submission.'

  const amountCents = Math.round(parseFloat(formData.get('amount') as string) * 100)

  const { error } = await supabase.from('receipts').insert({
    reimbursement_request_id: requestId,
    merchant_name: (formData.get('merchant_name') as string) || null,
    amount_cents: amountCents,
    category_id: parseInt(formData.get('category_id') as string),
    expense_date: formData.get('expense_date') as string,
    notes: (formData.get('notes') as string) || null,
  })

  if (error) return error.message

  const { data: receipts } = await supabase
    .from('receipts')
    .select('amount_cents')
    .eq('reimbursement_request_id', requestId)

  const total = (receipts ?? []).reduce((sum, r) => sum + r.amount_cents, 0)
  await supabase
    .from('reimbursement_requests')
    .update({ total_amount_cents: total })
    .eq('id', requestId)

  revalidatePath(`/coach/reimbursements/${requestId}`)
  return null
}

export async function removeReceipt(requestId: string, receiptId: string): Promise<void> {
  const profile = await requireCoach()
  const supabase = await createClient()

  const { data: req } = await supabase
    .from('reimbursement_requests')
    .select('coach_id, status')
    .eq('id', requestId)
    .single()

  if (!req || req.coach_id !== profile.id) throw new Error('Not authorized.')
  if (req.status !== 'pending') throw new Error('Cannot remove receipts after submission.')

  await supabase.from('receipts').delete().eq('id', receiptId)

  const { data: receipts } = await supabase
    .from('receipts')
    .select('amount_cents')
    .eq('reimbursement_request_id', requestId)

  const total = (receipts ?? []).reduce((sum, r) => sum + r.amount_cents, 0)
  await supabase
    .from('reimbursement_requests')
    .update({ total_amount_cents: total })
    .eq('id', requestId)

  revalidatePath(`/coach/reimbursements/${requestId}`)
}

export async function submitReimbursementRequest(requestId: string): Promise<void> {
  const profile = await requireCoach()
  const supabase = await createClient()

  const { data: req } = await supabase
    .from('reimbursement_requests')
    .select('coach_id, total_amount_cents')
    .eq('id', requestId)
    .single()

  if (!req || req.coach_id !== profile.id) throw new Error('Not authorized.')
  if ((req.total_amount_cents ?? 0) === 0) throw new Error('Add at least one receipt before submitting.')

  await supabase
    .from('reimbursement_requests')
    .update({ status: 'under_review' })
    .eq('id', requestId)

  revalidatePath('/coach/reimbursements')
  revalidatePath(`/coach/reimbursements/${requestId}`)
}
