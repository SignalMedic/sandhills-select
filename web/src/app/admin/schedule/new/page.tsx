import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ScheduleForm from '../ScheduleForm'
import { createScheduleEntry } from '../actions'

export const metadata = { title: 'Add Schedule Entry — Admin' }

export default async function NewScheduleEntryPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: teams } = await supabase
    .from('teams')
    .select('id, name, age_group')
    .eq('active', true)
    .order('name')

  return (
    <div className="p-4 lg:p-8">
      <Link
        href="/admin/schedule"
        className="text-xs font-display font-bold uppercase text-gray-400 hover:text-brand-navy mb-6 inline-block"
      >
        ← Schedule
      </Link>
      <h1 className="font-display font-bold text-brand-navy text-3xl uppercase mb-8">
        Add Schedule Entry
      </h1>
      <ScheduleForm action={createScheduleEntry} teams={teams ?? []} />
    </div>
  )
}
