import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Teams — Admin' }

export default async function TeamsPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: teams } = await supabase
    .from('teams')
    .select(`
      id, name, age_group, season, active,
      coach_teams(is_head_coach, profiles(full_name)),
      players(id)
    `)
    .order('active', { ascending: false })
    .order('name')

  return (
    <div className="p-4 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-brand-navy text-3xl uppercase">Teams</h1>
          <p className="text-gray-500 mt-1">{teams?.filter((t) => t.active).length ?? 0} active</p>
        </div>
        <Link
          href="/admin/teams/new"
          className="px-4 py-2 bg-brand-red text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-red-700 transition-colors"
        >
          + New Team
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        {!teams?.length ? (
          <p className="p-8 text-center text-gray-400 text-sm">No teams yet.</p>
        ) : (
          teams.map((t) => {
            const headCoach = (t.coach_teams as unknown as { is_head_coach: boolean; profiles: { full_name: string } | null }[])
              ?.find((ct) => ct.is_head_coach)
            return (
              <div key={t.id} className="flex items-start justify-between px-4 py-4 gap-2">
                <div>
                  <p className="font-semibold text-brand-navy text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {t.age_group} · {t.season}
                    {headCoach?.profiles?.full_name && ` · ${headCoach.profiles.full_name}`}
                    {` · ${(t.players as { id: string }[])?.length ?? 0} players`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {!t.active && (
                    <span className="text-xs font-display font-bold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-500">
                      Inactive
                    </span>
                  )}
                  <Link
                    href={`/admin/teams/${t.id}`}
                    className="text-xs font-display font-bold uppercase text-brand-navy hover:text-brand-red"
                  >
                    Manage →
                  </Link>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
