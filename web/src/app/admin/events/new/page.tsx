import Link from 'next/link'
import EventForm from '../EventForm'
import { createEvent } from '../actions'

export const metadata = { title: 'New Event — Admin' }

export default function NewEventPage() {
  return (
    <div className="p-4 lg:p-8">
      <Link
        href="/admin/events"
        className="text-xs font-display font-bold uppercase text-gray-400 hover:text-brand-navy mb-6 inline-block"
      >
        ← Events
      </Link>
      <h1 className="font-display font-bold text-brand-navy text-3xl uppercase mb-8">
        New Event
      </h1>
      <EventForm action={createEvent} submitLabel="Save Draft" />
    </div>
  )
}
