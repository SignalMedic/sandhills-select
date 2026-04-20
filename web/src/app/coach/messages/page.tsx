import { requireCoach } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Messages — Coach Portal' }

export default async function CoachMessagesPage() {
  const profile = await requireCoach()
  const supabase = await createClient()

  const { data: coachTeams } = await supabase
    .from('coach_teams')
    .select('team_id')
    .eq('coach_id', profile.id)

  const teamIds = coachTeams?.map((ct) => ct.team_id) ?? []

  const { data: messages } = teamIds.length
    ? await supabase
        .from('messages')
        .select('id, sender_name, sender_email, subject, read, created_at, teams(name)')
        .eq('recipient_type', 'team')
        .in('team_id', teamIds)
        .order('created_at', { ascending: false })
    : { data: [] }

  const unreadCount = (messages ?? []).filter((m) => !m.read).length

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-brand-navy text-3xl uppercase">Messages</h1>
        {unreadCount > 0 && (
          <p className="text-gray-500 mt-1">{unreadCount} unread</p>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        {!messages?.length ? (
          <p className="p-8 text-center text-gray-400 text-sm">No messages for your teams yet.</p>
        ) : (
          (messages ?? []).map((m) => (
            <Link
              key={m.id}
              href={`/coach/messages/${m.id}`}
              className={`flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors ${!m.read ? 'bg-blue-50' : ''}`}
            >
              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center gap-2">
                  {!m.read && <span className="w-2 h-2 rounded-full bg-brand-red shrink-0" />}
                  <p className={`text-sm truncate ${!m.read ? 'font-bold text-brand-navy' : 'font-medium text-gray-700'}`}>
                    {m.subject}
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {m.sender_name} · {(m.teams as unknown as { name: string } | null)?.name}
                </p>
              </div>
              <p className="text-xs text-gray-400 shrink-0">
                {new Date(m.created_at).toLocaleDateString()}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
