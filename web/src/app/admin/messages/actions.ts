'use server'

import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markMessageRead(id: string): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()

  await supabase.from('messages').update({ read: true }).eq('id', id)
  revalidatePath('/admin/messages')
  revalidatePath(`/admin/messages/${id}`)
}
