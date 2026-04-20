import { requireCoach } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import HighlightForm from './HighlightForm'
import { postHighlight } from '../actions'

export const metadata = { title: 'Post Highlight — Coach Portal' }

export default async function PostHighlightPage() {
  const profile = await requireCoach()
  const supabase = await createClient()

  const { data: coachTeams } = await supabase
    .from('coach_teams')
    .select('team_id, teams(id, name)')
    .eq('coach_id', profile.id)

  const teams = (coachTeams ?? [])
    .map((ct) => ct.teams as unknown as { id: string; name: string } | null)
    .filter(Boolean) as { id: string; name: string }[]

  return (
    <div className="p-4 lg:p-8">
      <Link
        href="/coach"
        className="text-xs font-display font-bold uppercase text-gray-400 hover:text-brand-navy mb-6 inline-block"
      >
        ← Dashboard
      </Link>
      <h1 className="font-display font-bold text-brand-navy text-3xl uppercase mb-2">Post Highlight</h1>
      <p className="text-gray-500 text-sm mb-8">
        Submitted highlights go to an admin for review before appearing on the public site.
      </p>
      <HighlightForm action={postHighlight} teams={teams} />
    </div>
  )
}
