import { requireCoach } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import PlayerRoster from '@/components/PlayerRoster'
import { addPlayer, updatePlayer, removePlayer } from './actions'

export const metadata = { title: 'Roster — Coach Portal' }

export default async function CoachRosterPage() {
  const profile = await requireCoach()
  const supabase = await createClient()

  const { data: coachTeams } = await supabase
    .from('coach_teams')
    .select('team_id, is_head_coach, teams(id, name, age_group, season)')
    .eq('coach_id', profile.id)

  const teamIds = coachTeams?.map((ct) => ct.team_id) ?? []

  const { data: players } = teamIds.length
    ? await supabase
        .from('players')
        .select('id, full_name, jersey_number, position, email, phone, team_id')
        .in('team_id', teamIds)
        .order('jersey_number')
    : { data: [] }

  type PlayerRow = { id: string; full_name: string; jersey_number: string | null; position: string | null; email: string | null; phone: string | null; team_id: string }
  const playersByTeam = (players ?? []).reduce<Record<string, PlayerRow[]>>((acc, p) => {
    const row = p as unknown as PlayerRow
    if (!acc[row.team_id]) acc[row.team_id] = []
    acc[row.team_id]!.push(row)
    return acc
  }, {})

  type Player = { id: string; full_name: string; jersey_number: string | null; position: string | null; email: string | null; phone: string | null; editAction: (prev: string | null, formData: FormData) => Promise<string | null>; removeAction: () => Promise<void> }

  return (
    <div className="p-4 lg:p-8">
      <h1 className="font-display font-bold text-brand-navy text-3xl uppercase mb-8">Roster</h1>

      {!coachTeams?.length ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-400 text-sm">You are not assigned to any teams yet.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {coachTeams.map((ct) => {
            const team = ct.teams as unknown as { id: string; name: string; age_group: string; season: string } | null
            if (!team) return null

            const roster = (playersByTeam[ct.team_id] ?? []).map((p) => ({
              ...(p as unknown as Omit<Player, 'editAction' | 'removeAction'>),
              editAction: updatePlayer.bind(null, p.id, team.id),
              removeAction: removePlayer.bind(null, p.id, team.id),
            })) as Player[]

            return (
              <div key={ct.team_id}>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="font-display font-bold text-brand-navy text-xl uppercase">{team.name}</h2>
                  <span className="text-xs text-gray-400 font-display uppercase">{team.age_group} · {team.season}</span>
                  {ct.is_head_coach && (
                    <span className="text-xs font-display font-bold uppercase px-2 py-0.5 rounded bg-brand-navy text-white">
                      Head Coach
                    </span>
                  )}
                </div>
                <PlayerRoster
                  players={roster}
                  addAction={addPlayer.bind(null, team.id)}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
