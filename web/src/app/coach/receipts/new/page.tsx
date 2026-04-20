import { requireCoach } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import NewRequestForm from './NewRequestForm'
import { createReimbursementRequest } from '../../reimbursements/actions'

export const metadata = { title: 'Submit Receipt — Coach Portal' }

export default async function SubmitReceiptPage() {
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
        href="/coach/reimbursements"
        className="text-xs font-display font-bold uppercase text-gray-400 hover:text-brand-navy mb-6 inline-block"
      >
        ← Reimbursements
      </Link>
      <h1 className="font-display font-bold text-brand-navy text-3xl uppercase mb-2">
        New Reimbursement Request
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Start a request, then add individual receipts before submitting for approval.
      </p>
      <NewRequestForm action={createReimbursementRequest} teams={teams} />
    </div>
  )
}
