import Link from 'next/link'
import TeamForm from '../TeamForm'
import { createTeam } from '../actions'

export const metadata = { title: 'New Team — Admin' }

export default function NewTeamPage() {
  return (
    <div className="p-4 lg:p-8">
      <Link
        href="/admin/teams"
        className="text-xs font-display font-bold uppercase text-gray-400 hover:text-brand-navy mb-6 inline-block"
      >
        ← Teams
      </Link>
      <h1 className="font-display font-bold text-brand-navy text-3xl uppercase mb-8">New Team</h1>
      <TeamForm action={createTeam} submitLabel="Create Team" />
    </div>
  )
}
