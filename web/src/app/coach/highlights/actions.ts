'use server'

import { requireCoach } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function postHighlight(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const profile = await requireCoach()
  const supabase = await createClient()

  const type = formData.get('type') as string
  let mediaUrl: string | null = null

  if (type === 'photo') {
    const file = formData.get('photo') as File | null
    if (!file || file.size === 0) return 'Please select a photo to upload.'

    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${profile.id}/${Date.now()}.${ext}`
    const bytes = new Uint8Array(await file.arrayBuffer())

    const { error: uploadError } = await supabase.storage
      .from('highlights')
      .upload(path, bytes, { contentType: file.type, upsert: false })

    if (uploadError) return uploadError.message

    const { data: urlData } = supabase.storage.from('highlights').getPublicUrl(path)
    mediaUrl = urlData.publicUrl
  } else if (type === 'video') {
    mediaUrl = ((formData.get('media_url') as string) ?? '').trim() || null
    if (!mediaUrl) return 'A video URL is required.'
  }

  const { error } = await supabase.from('highlights').insert({
    coach_id: profile.id,
    team_id: formData.get('team_id') as string,
    type,
    caption: formData.get('caption') as string,
    media_url: mediaUrl,
  })

  if (error) return error.message
  revalidatePath('/coach')
  redirect('/coach')
}
