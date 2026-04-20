import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import ContactDirectory from './ContactDirectory'

export const metadata = { title: 'Contacts — Admin' }

export default async function AdminContactPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: teams } = await supabase
    .from('teams')
    .select('id, name, age_group')
    .eq('active', true)
    .order('name')

  const { data: players } = await supabase
    .from('players')
    .select('id, full_name, jersey_number, email, phone, team_id')
    .in('team_id', (teams ?? []).map((t) => t.id))
    .order('jersey_number')

  const { data: coaches } = await supabase
    .from('coach_teams')
    .select('team_id, is_head_coach, profiles(full_name, email)')
    .in('team_id', (teams ?? []).map((t) => t.id))

  const teamList = (teams ?? []).map((team) => ({
    id: team.id,
    name: team.name,
    age_group: team.age_group,
    players: (players ?? [])
      .filter((p) => p.team_id === team.id)
      .map((p) => ({ id: p.id, full_name: p.full_name, jersey_number: p.jersey_number, email: p.email, phone: p.phone })),
    coaches: (coaches ?? [])
      .filter((c) => c.team_id === team.id)
      .map((c) => {
        const profile = c.profiles as unknown as { full_name: string; email: string } | null
        return { full_name: profile?.full_name ?? '', email: profile?.email ?? '', is_head_coach: c.is_head_coach }
      })
      .filter((c) => c.email),
  }))

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-brand-navy text-3xl uppercase">Contacts</h1>
        <p className="text-gray-500 mt-1">Player and coach contact information by team.</p>
      </div>
      <ContactDirectory teams={teamList} />
    </div>
  )
}
