import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import RejectForm from './RejectForm'
import { approveHighlight, rejectHighlight } from '../actions'

export const metadata = { title: 'Review Highlight — Admin' }

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

export default async function HighlightDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const supabase = await createClient()

  const { data: h } = await supabase
    .from('highlights')
    .select('*, profiles(full_name, email), teams(name)')
    .eq('id', id)
    .single()

  if (!h) notFound()

  const coach = h.profiles as { full_name: string; email: string } | null
  const team = h.teams as { name: string } | null
  const approveAction = approveHighlight.bind(null, id)
  const boundReject = rejectHighlight.bind(null, id)

  return (
    <div className="p-8 max-w-2xl space-y-8">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/highlights"
          className="text-xs font-display font-bold uppercase text-gray-400 hover:text-brand-navy"
        >
          ← Highlights
        </Link>
        <span className={`text-xs font-display font-bold uppercase px-2 py-0.5 rounded ${statusColor[h.status] ?? ''}`}>
          {h.status}
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Coach</p>
            <p className="text-brand-navy">{coach?.full_name}</p>
            <p className="text-gray-500 text-xs">{coach?.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Team</p>
            <p className="text-brand-navy">{team?.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Type</p>
            <p className="text-brand-navy capitalize">{h.type}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Submitted</p>
            <p className="text-brand-navy">{new Date(h.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase font-bold mb-1">Caption</p>
          <p className="text-sm text-gray-700">{h.caption}</p>
        </div>

        {h.media_url && (
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold mb-2">Media</p>
            {h.type === 'photo' ? (
              <img
                src={h.media_url}
                alt="Highlight"
                className="rounded max-h-64 object-contain border border-gray-200"
              />
            ) : (
              <a
                href={h.media_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand-red hover:underline"
              >
                View media →
              </a>
            )}
          </div>
        )}

        {h.rejection_reason && (
          <div className="bg-red-50 border border-red-200 rounded px-4 py-3">
            <p className="text-xs font-bold uppercase text-red-600 mb-1">Rejection Reason</p>
            <p className="text-sm text-red-700">{h.rejection_reason}</p>
          </div>
        )}
      </div>

      {h.status !== 'approved' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="font-display font-bold text-brand-navy text-lg uppercase mb-4">Approve</h2>
          <form action={approveAction}>
            <button
              type="submit"
              className="px-5 py-2 bg-green-600 text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-green-700 transition-colors"
            >
              Approve &amp; Publish
            </button>
          </form>
        </div>
      )}

      {h.status !== 'rejected' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="font-display font-bold text-brand-navy text-lg uppercase mb-4">Reject</h2>
          <RejectForm action={boundReject} />
        </div>
      )}
    </div>
  )
}
