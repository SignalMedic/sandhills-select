'use server'

import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createAnnouncement(_prev: string | null, formData: FormData): Promise<string | null> {
  const profile = await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase.from('announcements').insert({
    title: formData.get('title') as string,
    body: formData.get('body') as string,
    author_id: profile.id,
  })

  if (error) return error.message
  revalidatePath('/admin/announcements')
  redirect('/admin/announcements')
}

export async function updateAnnouncement(id: string, _prev: string | null, formData: FormData): Promise<string | null> {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('announcements')
    .update({
      title: formData.get('title') as string,
      body: formData.get('body') as string,
    })
    .eq('id', id)

  if (error) return error.message
  revalidatePath('/admin/announcements')
  redirect('/admin/announcements')
}

export async function toggleAnnouncementPublish(id: string, currentStatus: string): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()

  const newStatus = currentStatus === 'published' ? 'draft' : 'published'
  const { error } = await supabase
    .from('announcements')
    .update({
      status: newStatus,
      published_at: newStatus === 'published' ? new Date().toISOString() : null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/announcements')
  revalidatePath(`/admin/announcements/${id}`)
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase.from('announcements').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/announcements')
  redirect('/admin/announcements')
}
