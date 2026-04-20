import { requireCoach } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const metadata = { title: 'Message — Coach Portal' }

export default async function CoachMessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const profile = await requireCoach()
  const { id } = await params
  const supabase = await createClient()

  const { data: message } = await supabase
    .from('messages')
    .select('*, teams(name)')
    .eq('id', id)
    .single()

  if (!message) notFound()

  // Verify this coach has access (message must be to one of their teams)
  const { data: coachTeams } = await supabase
    .from('coach_teams')
    .select('team_id')
    .eq('coach_id', profile.id)

  const teamIds = coachTeams?.map((ct) => ct.team_id) ?? []
  if (!message.team_id || !teamIds.includes(message.team_id)) notFound()

  if (!message.read) {
    await supabase.from('messages').update({ read: true }).eq('id', id)
  }

  const teamName = (message.teams as unknown as { name: string } | null)?.name

  return (
    <div className="p-8 max-w-2xl">
      <Link
        href="/coach/messages"
        className="text-xs font-display font-bold uppercase text-gray-400 hover:text-brand-navy mb-6 inline-block"
      >
        ← Messages
      </Link>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div>
          <h1 className="font-display font-bold text-brand-navy text-2xl uppercase">{message.subject}</h1>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(message.created_at).toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              hour: 'numeric', minute: '2-digit',
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-4">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">From</p>
            <p className="text-brand-navy font-semibold">{message.sender_name}</p>
            <a
              href={`mailto:${message.sender_email}`}
              className="text-xs text-brand-red hover:underline"
            >
              {message.sender_email}
            </a>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">To</p>
            <p className="text-brand-navy">{teamName}</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{message.body}</p>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <a
            href={`mailto:${message.sender_email}?subject=Re: ${encodeURIComponent(message.subject)}`}
            className="inline-block px-5 py-2 bg-brand-navy text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-brand-navy-light transition-colors"
          >
            Reply via Email
          </a>
        </div>
      </div>
    </div>
  )
}
