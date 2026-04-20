import { requireCoach } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import ContactDirectory from '@/app/admin/contact/ContactDirectory'

export const metadata = { title: 'Contacts — Coach Portal' }

export default async function CoachContactPage() {
  const profile = await requireCoach()
  const supabase = await createClient()

  const { data: coachTeams } = await supabase
    .from('coach_teams')
    .select('team_id, teams(id, name, age_group)')
    .eq('coach_id', profile.id)

  const teamIds = coachTeams?.map((ct) => ct.team_id) ?? []

  if (!teamIds.length) {
    return (
      <div className="p-4 lg:p-8">
        <h1 className="font-display font-bold text-brand-navy text-3xl uppercase mb-8">Contacts</h1>
        <p className="text-gray-400 text-sm">You are not assigned to any teams yet.</p>
      </div>
    )
  }

  const [{ data: players }, { data: coaches }] = await Promise.all([
    supabase
      .from('players')
      .select('id, full_name, jersey_number, email, phone, team_id')
      .in('team_id', teamIds)
      .order('jersey_number'),
    supabase
      .from('coach_teams')
      .select('team_id, is_head_coach, profiles(full_name, email)')
      .in('team_id', teamIds),
  ])

  const teamList = (coachTeams ?? []).map((ct) => {
    const team = ct.teams as unknown as { id: string; name: string; age_group: string } | null
    if (!team) return null
    return {
      id: team.id,
      name: team.name,
      age_group: team.age_group,
      players: (players ?? [])
        .filter((p) => p.team_id === ct.team_id)
        .map((p) => ({ id: p.id, full_name: p.full_name, jersey_number: p.jersey_number, email: p.email, phone: p.phone })),
      coaches: (coaches ?? [])
        .filter((c) => c.team_id === ct.team_id)
        .map((c) => {
          const p = c.profiles as unknown as { full_name: string; email: string } | null
          return { full_name: p?.full_name ?? '', email: p?.email ?? '', is_head_coach: c.is_head_coach }
        })
        .filter((c) => c.email),
    }
  }).filter(Boolean) as { id: string; name: string; age_group: string; players: { id: string; full_name: string; jersey_number: string | null; email: string | null; phone: string | null }[]; coaches: { full_name: string; email: string; is_head_coach: boolean }[] }[]

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-brand-navy text-3xl uppercase">Contacts</h1>
        <p className="text-gray-500 mt-1">Player and coach contact information for your teams.</p>
      </div>
      <ContactDirectory teams={teamList} />
    </div>
  )
}
