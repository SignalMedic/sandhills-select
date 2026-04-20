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

  const mediaUrl = (formData.get('media_url') as string).trim() || null
  const type = formData.get('type') as string

  if ((type === 'photo' || type === 'video') && !mediaUrl) {
    return `A URL is required for ${type} highlights.`
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
