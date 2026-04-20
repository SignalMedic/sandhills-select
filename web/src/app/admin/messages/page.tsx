import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Messages — Admin' }

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  await requireAdmin()
  const supabase = await createClient()
  const { filter } = await searchParams

  let query = supabase
    .from('messages')
    .select('id, sender_name, sender_email, subject, recipient_type, read, created_at, teams(name)')
    .order('created_at', { ascending: false })

  if (filter === 'unread') query = query.eq('read', false)

  const { data: messages } = await query

  return (
    <div className="p-4 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-brand-navy text-3xl uppercase">Messages</h1>
          <p className="text-gray-500 mt-1">
            {messages?.filter((m) => !m.read).length ?? 0} unread
          </p>
        </div>
        <div className="flex gap-1">
          <Link
            href="/admin/messages"
            className={`px-3 py-1.5 text-xs font-display font-bold uppercase tracking-wider rounded transition-colors ${
              !filter
                ? 'bg-brand-navy text-white'
                : 'bg-white border border-gray-200 text-gray-500 hover:text-brand-navy'
            }`}
          >
            All
          </Link>
          <Link
            href="/admin/messages?filter=unread"
            className={`px-3 py-1.5 text-xs font-display font-bold uppercase tracking-wider rounded transition-colors ${
              filter === 'unread'
                ? 'bg-brand-navy text-white'
                : 'bg-white border border-gray-200 text-gray-500 hover:text-brand-navy'
            }`}
          >
            Unread
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        {!messages?.length ? (
          <p className="p-8 text-center text-gray-400 text-sm">No messages.</p>
        ) : (
          messages.map((m) => (
            <Link
              key={m.id}
              href={`/admin/messages/${m.id}`}
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
                  {m.sender_name} · {m.sender_email}
                  {m.recipient_type === 'team' && (m.teams as unknown as { name: string } | null)?.name
                    ? ` → ${(m.teams as unknown as { name: string }).name}`
                    : ' → Organization'}
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
