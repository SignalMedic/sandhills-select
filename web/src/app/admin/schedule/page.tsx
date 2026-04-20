import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DeleteButton from '@/components/DeleteButton'
import { deleteScheduleEntry } from './actions'

export const metadata = { title: 'Schedule — Admin' }

export default async function SchedulePage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: entries } = await supabase
    .from('schedule_entries')
    .select('*, teams(name, age_group)')
    .order('starts_at')

  const grouped = (entries ?? []).reduce<Record<string, typeof entries>>((acc, entry) => {
    const day = new Date(entry.starts_at).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    if (!acc[day]) acc[day] = []
    acc[day]!.push(entry)
    return acc
  }, {})

  return (
    <div className="p-4 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-brand-navy text-3xl uppercase">Schedule</h1>
          <p className="text-gray-500 mt-1">{entries?.length ?? 0} entries</p>
        </div>
        <Link
          href="/admin/schedule/new"
          className="px-4 py-2 bg-brand-red text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-red-700 transition-colors"
        >
          + Add Entry
        </Link>
      </div>

      {!entries?.length ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-400 text-sm">No schedule entries yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([day, dayEntries]) => (
            <div key={day}>
              <p className="text-xs font-display font-bold uppercase tracking-wider text-gray-400 mb-2">
                {day}
              </p>
              <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
                {dayEntries!.map((entry) => {
                  const deleteAction = deleteScheduleEntry.bind(null, entry.id)
                  return (
                    <div key={entry.id} className="flex items-start justify-between px-4 py-4 gap-2">
                      <div>
                        <p className="font-semibold text-brand-navy text-sm capitalize">
                          {entry.type}
                          {entry.opponent ? ` vs. ${entry.opponent}` : ''}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {(entry.teams as { name: string; age_group: string } | null)?.name} ·{' '}
                          {new Date(entry.starts_at).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}{' '}
                          · {entry.location}
                        </p>
                      </div>
                      <DeleteButton action={deleteAction} confirmMessage="Remove this schedule entry?" />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
