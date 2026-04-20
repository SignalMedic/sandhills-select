'use server'

import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createScheduleEntry(_prev: string | null, formData: FormData): Promise<string | null> {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase.from('schedule_entries').insert({
    team_id: formData.get('team_id') as string,
    type: formData.get('type') as string,
    opponent: (formData.get('opponent') as string) || null,
    location: formData.get('location') as string,
    starts_at: formData.get('starts_at') as string,
    ends_at: formData.get('ends_at') as string,
    notes: (formData.get('notes') as string) || null,
  })

  if (error) return error.message
  revalidatePath('/admin/schedule')
  redirect('/admin/schedule')
}

export async function deleteScheduleEntry(id: string): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase.from('schedule_entries').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/schedule')
}
