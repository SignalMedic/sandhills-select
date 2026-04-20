import { requireCoach } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'My Schedule — Coach Portal' }

export default async function CoachSchedulePage() {
  const profile = await requireCoach()
  const supabase = await createClient()

  const { data: coachTeams } = await supabase
    .from('coach_teams')
    .select('team_id')
    .eq('coach_id', profile.id)

  const teamIds = coachTeams?.map((ct) => ct.team_id) ?? []

  const { data: entries } = teamIds.length
    ? await supabase
        .from('schedule_entries')
        .select('*, teams(name, age_group)')
        .in('team_id', teamIds)
        .order('starts_at')
    : { data: [] }

  const now = new Date()
  const upcoming = (entries ?? []).filter((e) => new Date(e.ends_at) >= now)
  const past = (entries ?? []).filter((e) => new Date(e.ends_at) < now)

  type Entry = NonNullable<typeof entries>[number]
  function groupByDate(list: Entry[]) {
    return list.reduce<Record<string, Entry[]>>((acc, entry) => {
      const day = new Date(entry.starts_at).toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      })
      if (!acc[day]) acc[day] = []
      acc[day]!.push(entry)
      return acc
    }, {})
  }

  function EntryRow({ entry }: { entry: NonNullable<typeof entries>[number] }) {
    const team = entry.teams as { name: string; age_group: string } | null
    return (
      <div className="flex items-start gap-4 px-6 py-4">
        <div className="w-1 self-stretch rounded-full bg-brand-red shrink-0" />
        <div className="flex-1">
          <p className="font-semibold text-brand-navy text-sm capitalize">
            {entry.type}{entry.opponent ? ` vs. ${entry.opponent}` : ''}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {team?.name} · {new Date(entry.starts_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            {' '}–{' '}
            {new Date(entry.ends_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            {' · '}{entry.location}
          </p>
          {entry.notes && <p className="text-xs text-gray-500 mt-1">{entry.notes}</p>}
        </div>
      </div>
    )
  }

  const upcomingGrouped = groupByDate(upcoming)
  const pastGrouped = groupByDate(past.slice().reverse())

  return (
    <div className="p-4 lg:p-8">
      <h1 className="font-display font-bold text-brand-navy text-3xl uppercase mb-8">My Schedule</h1>

      {!upcoming.length && !past.length ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-400 text-sm">No schedule entries yet.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {upcoming.length > 0 && (
            <div>
              <h2 className="font-display font-bold text-brand-navy text-lg uppercase mb-4">Upcoming</h2>
              <div className="space-y-4">
                {Object.entries(upcomingGrouped).map(([day, dayEntries]) => (
                  <div key={day}>
                    <p className="text-xs font-display font-bold uppercase tracking-wider text-gray-400 mb-2">{day}</p>
                    <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
                      {dayEntries!.map((e) => <EntryRow key={e.id} entry={e} />)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h2 className="font-display font-bold text-brand-navy text-lg uppercase mb-4 text-gray-400">Past</h2>
              <div className="space-y-4">
                {Object.entries(pastGrouped).map(([day, dayEntries]) => (
                  <div key={day}>
                    <p className="text-xs font-display font-bold uppercase tracking-wider text-gray-400 mb-2">{day}</p>
                    <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100 opacity-60">
                      {dayEntries!.map((e) => <EntryRow key={e.id} entry={e} />)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
