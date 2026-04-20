'use server'

import { requireCoach } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(_prev: string | null, formData: FormData): Promise<string | null> {
  const profile = await requireCoach()
  const supabase = await createClient()

  const full_name = (formData.get('full_name') as string).trim()
  if (!full_name) return 'Name is required.'

  const { error } = await supabase
    .from('profiles')
    .update({ full_name })
    .eq('id', profile.id)

  if (error) return error.message
  revalidatePath('/coach')
  revalidatePath('/coach/profile')
  return null
}
