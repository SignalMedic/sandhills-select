import Link from 'next/link'
import AnnouncementForm from '../AnnouncementForm'
import { createAnnouncement } from '../actions'

export const metadata = { title: 'New Announcement — Admin' }

export default function NewAnnouncementPage() {
  return (
    <div className="p-4 lg:p-8">
      <Link
        href="/admin/announcements"
        className="text-xs font-display font-bold uppercase text-gray-400 hover:text-brand-navy mb-6 inline-block"
      >
        ← Announcements
      </Link>
      <h1 className="font-display font-bold text-brand-navy text-3xl uppercase mb-8">
        New Announcement
      </h1>
      <AnnouncementForm action={createAnnouncement} submitLabel="Save Draft" />
    </div>
  )
}
