'use server'

import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveHighlight(id: string): Promise<void> {
  const profile = await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('highlights')
    .update({
      status: 'approved',
      approved_by: profile.id,
      approved_at: new Date().toISOString(),
      rejection_reason: null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/highlights')
  revalidatePath(`/admin/highlights/${id}`)
}

export async function rejectHighlight(id: string, _prev: string | null, formData: FormData): Promise<string | null> {
  await requireAdmin()
  const supabase = await createClient()

  const reason = (formData.get('rejection_reason') as string).trim()
  if (!reason) return 'Rejection reason is required.'

  const { error } = await supabase
    .from('highlights')
    .update({ status: 'rejected', rejection_reason: reason })
    .eq('id', id)

  if (error) return error.message
  revalidatePath('/admin/highlights')
  revalidatePath(`/admin/highlights/${id}`)
  return null
}
