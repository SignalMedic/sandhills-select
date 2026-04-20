'use server'

import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function approveHighlight(id: string): Promise<void> {
  const profile = await requireAdmin()
  const supabase = await createClient()

  const { data: highlight } = await supabase
    .from('highlights')
    .select('caption, type, media_url, teams!team_id(name)')
    .eq('id', id)
    .single()

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

  const team = highlight?.teams as unknown as { name: string } | null
  const typeLabel = highlight?.type === 'photo' ? 'Photo' : highlight?.type === 'video' ? 'Video' : 'Update'
  const suggestedTitle = team ? `${team.name} — ${typeLabel}` : typeLabel

  const { data: announcement } = await supabase
    .from('announcements')
    .insert({
      title: suggestedTitle,
      body: highlight?.caption ?? '',
      author_id: profile.id,
      status: 'draft',
      media_url: highlight?.type === 'photo' ? (highlight?.media_url ?? null) : null,
    })
    .select('id')
    .single()

  revalidatePath('/admin/highlights')
  revalidatePath('/admin/announcements')

  if (announcement) {
    redirect(`/admin/announcements/${announcement.id}`)
  } else {
    redirect('/admin/highlights')
  }
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
