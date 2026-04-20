import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PlayerRoster from '@/components/PlayerRoster'
import DeleteButton from '@/components/DeleteButton'
import { CoachAssignForm } from './InlineForm'
import TeamInfoForm from './TeamInfoForm'
import { updateTeam, assignCoach, removeCoach, addPlayer, updatePlayer, removePlayer } from '../actions'

export const metadata = { title: 'Team — Admin' }

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const supabase = await createClient()

  const [{ data: team }, { data: coaches }, { data: players }] = await Promise.all([
    supabase.from('teams').select('*').eq('id', id).single(),
    supabase
      .from('coach_teams')
      .select('coach_id, is_head_coach, profiles(full_name, email)')
      .eq('team_id', id),
    supabase
      .from('players')
      .select('id, full_name, jersey_number, position, email, phone, team_id')
      .eq('team_id', id)
      .order('jersey_number'),
  ])

  if (!team) notFound()

  const boundUpdateTeam = updateTeam.bind(null, id)
  const boundAssignCoach = assignCoach.bind(null, id)

  type Player = { id: string; full_name: string; jersey_number: string | null; position: string | null; email: string | null; phone: string | null }
  const roster = (players ?? []) as unknown as Player[]

  return (
    <div className="p-4 lg:p-8 space-y-10">
      <div>
        <Link
          href="/admin/teams"
          className="text-xs font-display font-bold uppercase text-gray-400 hover:text-brand-navy"
        >
          ← Teams
        </Link>
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <h1 className="font-display font-bold text-brand-navy text-3xl uppercase">{team.name}</h1>
          <span className="text-sm text-gray-400">{team.age_group} · {team.season}</span>
          {!team.active && (
            <span className="text-xs font-display font-bold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-500">Inactive</span>
          )}
        </div>
      </div>

      {/* Edit team info */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="font-display font-bold text-brand-navy text-lg uppercase mb-4">Team Info</h2>
        <TeamInfoForm
          action={boundUpdateTeam}
          initial={{ name: team.name, age_group: team.age_group, season: team.season }}
        />
      </section>

      {/* Coaches */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="font-display font-bold text-brand-navy text-lg uppercase mb-4">Coaches</h2>

        {coaches?.length ? (
          <div className="divide-y divide-gray-100 mb-6 border border-gray-200 rounded-lg overflow-hidden">
            {coaches.map((ct) => {
              const p = ct.profiles as unknown as { full_name: string; email: string } | null
              const removeAction = removeCoach.bind(null, id, ct.coach_id)
              return (
                <div key={ct.coach_id} className="flex items-center justify-between px-4 py-3 gap-2">
                  <div>
                    <p className="text-sm font-semibold text-brand-navy">
                      {p?.full_name}
                      {ct.is_head_coach && <span className="ml-2 text-xs text-gray-400">(Head Coach)</span>}
                    </p>
                    <p className="text-xs text-gray-500">{p?.email}</p>
                  </div>
                  <DeleteButton action={removeAction} label="Remove" confirmMessage={`Remove ${p?.full_name} from this team?`} />
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-400 mb-6">No coaches assigned.</p>
        )}

        <div>
          <p className="text-xs font-display font-bold uppercase tracking-wider text-gray-500 mb-3">Assign Coach</p>
          <CoachAssignForm action={boundAssignCoach} />
        </div>
      </section>

      {/* Roster */}
      <section>
        <h2 className="font-display font-bold text-brand-navy text-xl uppercase mb-3">Roster</h2>
        <PlayerRoster
          players={roster}
          addAction={addPlayer.bind(null, id)}
          makeEditAction={(playerId) => updatePlayer.bind(null, playerId, id)}
          makeRemoveAction={(playerId) => removePlayer.bind(null, id, playerId)}
        />
      </section>
    </div>
  )
}
