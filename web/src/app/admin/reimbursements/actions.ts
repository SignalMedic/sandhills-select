'use server'

import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateReimbursementStatus(
  id: string,
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const profile = await requireAdmin()
  const supabase = await createClient()

  const status = formData.get('status') as string
  const denialReason = (formData.get('denial_reason') as string) || null

  const update: Record<string, unknown> = { status, denial_reason: denialReason }
  if (status === 'approved') {
    update.approved_by = profile.id
    update.approved_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('reimbursement_requests')
    .update(update)
    .eq('id', id)

  if (error) return error.message
  revalidatePath('/admin/reimbursements')
  revalidatePath(`/admin/reimbursements/${id}`)
  return null
}
