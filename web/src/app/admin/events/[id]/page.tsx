import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import EventForm from '../EventForm'
import DeleteButton from '@/components/DeleteButton'
import {
  updateEvent,
  toggleEventPublish,
  toggleEventRegistration,
  deleteEvent,
  markRegistrationPaid,
  removeRegistration,
} from '../actions'
import RegistrationsTable from './RegistrationsTable'

export const metadata = { title: 'Edit Event — Admin' }

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const supabase = await createClient()

  const { data: e } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (!e) notFound()

  const { data: registrations } = await supabase
    .from('event_registrations')
    .select('id, player_name, player_dob, position, age_group, registrant_name, registrant_email, registrant_phone, payment_status, amount_paid_cents, notes, created_at')
    .eq('event_id', id)
    .order('created_at', { ascending: false })

  const boundUpdate = updateEvent.bind(null, id)
  const togglePublish = toggleEventPublish.bind(null, id, e.status)
  const toggleReg = toggleEventRegistration.bind(null, id, e.registration_open)
  const deleteAction = deleteEvent.bind(null, id)
  const markPaid = markRegistrationPaid.bind(null, id)
  const removeReg = removeRegistration.bind(null, id)

  return (
    <div className="p-4 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/events"
          className="text-xs font-display font-bold uppercase text-gray-400 hover:text-brand-navy"
        >
          ← Events
        </Link>
        <span
          className={`text-xs font-display font-bold uppercase px-2 py-0.5 rounded ${
            e.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {e.status}
        </span>
        {e.registration_open && (
          <span className="text-xs font-display font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
            Registration Open
          </span>
        )}
      </div>

      <h1 className="font-display font-bold text-brand-navy text-3xl uppercase mb-8">Edit Event</h1>

      <EventForm
        action={boundUpdate}
        initial={{
          name: e.name,
          description: e.description,
          location: e.location,
          is_recurring: e.is_recurring,
          start_date: e.start_date,
          end_date: e.end_date,
          recurrence_days: e.recurrence_days,
          recurrence_time: e.recurrence_time,
          recurrence_end_time: e.recurrence_end_time,
          age_groups: e.age_groups,
          registration_open: e.registration_open,
          registration_deadline: e.registration_deadline,
          price_cents: e.price_cents,
          max_registrations: e.max_registrations,
          waiver_text: e.waiver_text,
        }}
        submitLabel="Save Changes"
      />

      <div className="flex gap-3 mt-8 pt-8 border-t border-gray-200">
        <form action={togglePublish}>
          <button
            type="submit"
            className={`px-4 py-2 text-white text-xs font-display font-bold uppercase tracking-wider rounded transition-colors ${
              e.status === 'published'
                ? 'bg-yellow-600 hover:bg-yellow-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {e.status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
        </form>
        <form action={toggleReg}>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-blue-700 transition-colors"
          >
            {e.registration_open ? 'Close Registration' : 'Open Registration'}
          </button>
        </form>
        <DeleteButton action={deleteAction} confirmMessage="Delete this event? All registrations will also be deleted." />
      </div>

      <RegistrationsTable
        registrations={registrations ?? []}
        exportHref={`/admin/events/${id}/export`}
        markPaid={markPaid}
        remove={removeReg}
      />
    </div>
  )
}
