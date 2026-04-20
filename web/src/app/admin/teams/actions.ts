'use server'

import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTeam(_prev: string | null, formData: FormData): Promise<string | null> {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase.from('teams').insert({
    name: formData.get('name') as string,
    age_group: formData.get('age_group') as string,
    season: formData.get('season') as string,
  })

  if (error) return error.message
  revalidatePath('/admin/teams')
  redirect('/admin/teams')
}

export async function updateTeam(id: string, _prev: string | null, formData: FormData): Promise<string | null> {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('teams')
    .update({
      name: formData.get('name') as string,
      age_group: formData.get('age_group') as string,
      season: formData.get('season') as string,
    })
    .eq('id', id)

  if (error) return error.message
  revalidatePath('/admin/teams')
  revalidatePath(`/admin/teams/${id}`)
  return null
}

export async function toggleTeamActive(id: string, currentActive: boolean): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('teams')
    .update({ active: !currentActive })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/teams')
  revalidatePath(`/admin/teams/${id}`)
}

export async function assignCoach(teamId: string, _prev: string | null, formData: FormData): Promise<string | null> {
  await requireAdmin()
  const supabase = await createClient()

  const email = (formData.get('email') as string).trim().toLowerCase()
  const isHead = formData.get('is_head_coach') === 'on'

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('email', email)
    .single()

  if (!profile) return `No coach found with email: ${email}`

  const { error } = await supabase.from('coach_teams').upsert({
    coach_id: profile.id,
    team_id: teamId,
    is_head_coach: isHead,
  })

  if (error) return error.message
  revalidatePath(`/admin/teams/${teamId}`)
  return null
}

export async function removeCoach(teamId: string, coachId: string): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('coach_teams')
    .delete()
    .eq('team_id', teamId)
    .eq('coach_id', coachId)

  if (error) throw new Error(error.message)
  revalidatePath(`/admin/teams/${teamId}`)
}

export async function addPlayer(teamId: string, _prev: string | null, formData: FormData): Promise<string | null> {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase.from('players').insert({
    team_id: teamId,
    full_name: formData.get('full_name') as string,
    jersey_number: (formData.get('jersey_number') as string) || null,
    position: (formData.get('position') as string) || null,
    email: (formData.get('email') as string) || null,
    phone: (formData.get('phone') as string) || null,
  })

  if (error) return error.message
  revalidatePath(`/admin/teams/${teamId}`)
  return null
}

export async function updatePlayer(playerId: string, teamId: string, _prev: string | null, formData: FormData): Promise<string | null> {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase.from('players').update({
    full_name: formData.get('full_name') as string,
    jersey_number: (formData.get('jersey_number') as string) || null,
    position: (formData.get('position') as string) || null,
    email: (formData.get('email') as string) || null,
    phone: (formData.get('phone') as string) || null,
  }).eq('id', playerId)

  if (error) return error.message
  revalidatePath(`/admin/teams/${teamId}`)
  return null
}

export async function removePlayer(teamId: string, playerId: string): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase.from('players').delete().eq('id', playerId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/teams/${teamId}`)
}
