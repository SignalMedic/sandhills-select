'use server'

import { requireCoach } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function assertCoachOwnsTeam(coachId: string, teamId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('coach_teams')
    .select('team_id')
    .eq('coach_id', coachId)
    .eq('team_id', teamId)
    .single()
  if (!data) throw new Error('Not authorized for this team.')
}

export async function addPlayer(teamId: string, _prev: string | null, formData: FormData): Promise<string | null> {
  const profile = await requireCoach()
  const supabase = await createClient()

  await assertCoachOwnsTeam(profile.id, teamId)

  const { error } = await supabase.from('players').insert({
    team_id: teamId,
    full_name: formData.get('full_name') as string,
    jersey_number: (formData.get('jersey_number') as string) || null,
    position: (formData.get('position') as string) || null,
    email: (formData.get('email') as string) || null,
    phone: (formData.get('phone') as string) || null,
  })

  if (error) return error.message
  revalidatePath('/coach/roster')
  return null
}

export async function updatePlayer(playerId: string, teamId: string, _prev: string | null, formData: FormData): Promise<string | null> {
  const profile = await requireCoach()
  const supabase = await createClient()

  await assertCoachOwnsTeam(profile.id, teamId)

  const { error } = await supabase.from('players').update({
    full_name: formData.get('full_name') as string,
    jersey_number: (formData.get('jersey_number') as string) || null,
    position: (formData.get('position') as string) || null,
    email: (formData.get('email') as string) || null,
    phone: (formData.get('phone') as string) || null,
  }).eq('id', playerId)

  if (error) return error.message
  revalidatePath('/coach/roster')
  return null
}

export async function removePlayer(playerId: string, teamId: string): Promise<void> {
  const profile = await requireCoach()
  const supabase = await createClient()

  await assertCoachOwnsTeam(profile.id, teamId)

  const { error } = await supabase.from('players').delete().eq('id', playerId)
  if (error) throw new Error(error.message)
  revalidatePath('/coach/roster')
}

export async function addTeamLink(teamId: string, _prev: string | null, formData: FormData): Promise<string | null> {
  const profile = await requireCoach()
  const supabase = await createClient()

  await assertCoachOwnsTeam(profile.id, teamId)

  const label = (formData.get('label') as string).trim()
  const url = (formData.get('url') as string).trim()
  if (!label || !url) return 'Label and URL are required.'

  const { error } = await supabase.from('team_links').insert({ team_id: teamId, label, url })
  if (error) return error.message
  revalidatePath('/coach/roster')
  return null
}

export async function removeTeamLink(teamId: string, linkId: string): Promise<void> {
  const profile = await requireCoach()
  const supabase = await createClient()

  await assertCoachOwnsTeam(profile.id, teamId)

  const { error } = await supabase.from('team_links').delete().eq('id', linkId)
  if (error) throw new Error(error.message)
  revalidatePath('/coach/roster')
}
