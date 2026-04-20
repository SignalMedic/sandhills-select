import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AnnouncementForm from '../AnnouncementForm'
import DeleteButton from '@/components/DeleteButton'
import {
  updateAnnouncement,
  toggleAnnouncementPublish,
  toggleAnnouncementPin,
  deleteAnnouncement,
} from '../actions'

export const metadata = { title: 'Edit Announcement — Admin' }

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const supabase = await createClient()

  const { data: a } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', id)
    .single()

  if (!a) notFound()

  const boundUpdate = updateAnnouncement.bind(null, id)
  const toggleAction = toggleAnnouncementPublish.bind(null, id, a.status)
  const pinAction = toggleAnnouncementPin.bind(null, id, a.pinned)
  const deleteAction = deleteAnnouncement.bind(null, id)

  return (
    <div className="p-4 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/announcements"
          className="text-xs font-display font-bold uppercase text-gray-400 hover:text-brand-navy"
        >
          ← Announcements
        </Link>
        <span
          className={`text-xs font-display font-bold uppercase px-2 py-0.5 rounded ${
            a.status === 'published'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {a.status}
        </span>
        {a.pinned && (
          <span className="text-xs font-display font-bold uppercase px-2 py-0.5 rounded bg-brand-navy text-white">
            Pinned
          </span>
        )}
      </div>

      <h1 className="font-display font-bold text-brand-navy text-3xl uppercase mb-8">
        Edit Announcement
      </h1>

      {a.media_url && (
        <div className="mb-6">
          <p className="text-xs font-display font-bold uppercase tracking-wider text-gray-500 mb-2">Attached Photo</p>
          <img
            src={a.media_url}
            alt={a.title}
            className="rounded-lg max-h-64 object-contain border border-gray-200"
          />
        </div>
      )}

      <AnnouncementForm
        action={boundUpdate}
        initialTitle={a.title}
        initialBody={a.body}
        submitLabel="Save Changes"
      />

      <div className="flex flex-wrap gap-3 mt-8 pt-8 border-t border-gray-200">
        <form action={toggleAction}>
          <button
            type="submit"
            className={`px-4 py-2 text-white text-xs font-display font-bold uppercase tracking-wider rounded transition-colors ${
              a.status === 'published'
                ? 'bg-yellow-600 hover:bg-yellow-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {a.status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
        </form>
        <form action={pinAction}>
          <button
            type="submit"
            className={`px-4 py-2 text-xs font-display font-bold uppercase tracking-wider rounded transition-colors ${
              a.pinned
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-brand-navy text-white hover:bg-brand-navy-light'
            }`}
          >
            {a.pinned ? 'Unpin' : 'Pin to Top'}
          </button>
        </form>
        <DeleteButton action={deleteAction} confirmMessage="Delete this announcement? This cannot be undone." />
      </div>
    </div>
  )
}
