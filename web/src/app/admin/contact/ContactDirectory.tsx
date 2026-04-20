'use client'

import { useState } from 'react'

type Player = { id: string; full_name: string; jersey_number: string | null; email: string | null; phone: string | null }
type Coach = { full_name: string; email: string; is_head_coach: boolean }
type Team = { id: string; name: string; age_group: string; players: Player[]; coaches: Coach[] }

function ComposePanel({ recipients, teamName }: { recipients: string[]; teamName: string }) {
  const [subject, setSubject] = useState(`${teamName} — `)
  const [body, setBody] = useState('')

  const mailto = `mailto:${recipients.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  return (
    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
      <p className="text-xs font-display font-bold uppercase tracking-wider text-gray-500">
        Compose Email · {recipients.length} recipient{recipients.length !== 1 ? 's' : ''}
      </p>
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        placeholder="Message…"
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy resize-y"
      />
      <a
        href={mailto}
        className="inline-block px-5 py-2 bg-brand-navy text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-brand-navy-light transition-colors"
      >
        Open in Email Client →
      </a>
    </div>
  )
}

function TeamCard({ team }: { team: Team }) {
  const [showCompose, setShowCompose] = useState(false)
  const playerEmails = team.players.filter((p) => p.email).map((p) => p.email!)
  const allEmails = [...new Set([...playerEmails, ...team.coaches.map((c) => c.email)])]

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-4 lg:px-6 py-4 flex items-start justify-between gap-3 border-b border-gray-100">
        <div>
          <h2 className="font-display font-bold text-brand-navy text-lg uppercase">{team.name}</h2>
          <p className="text-xs text-gray-400">{team.age_group}</p>
        </div>
        {allEmails.length > 0 && (
          <button
            onClick={() => setShowCompose(!showCompose)}
            className="shrink-0 px-3 py-1.5 bg-brand-navy text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-brand-navy-light transition-colors"
          >
            {showCompose ? 'Close' : `Email All (${allEmails.length})`}
          </button>
        )}
      </div>

      {showCompose && <div className="px-4 lg:px-6 py-2"><ComposePanel recipients={allEmails} teamName={team.name} /></div>}

      {team.coaches.length > 0 && (
        <div className="px-4 lg:px-6 py-3 border-b border-gray-100">
          <p className="text-xs font-display font-bold uppercase tracking-wider text-gray-400 mb-2">Coaches</p>
          <div className="space-y-2">
            {team.coaches.map((c) => (
              <div key={c.email} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-sm">
                <span className="text-brand-navy font-medium">
                  {c.full_name}
                  {c.is_head_coach && <span className="ml-2 text-xs text-gray-400">(Head)</span>}
                </span>
                <a href={`mailto:${c.email}`} className="text-xs text-brand-red hover:underline break-all">{c.email}</a>
              </div>
            ))}
          </div>
        </div>
      )}

      {team.players.length > 0 ? (
        <div className="divide-y divide-gray-50">
          {team.players.map((p) => (
            <div key={p.id} className="px-4 lg:px-6 py-3">
              <p className="text-sm text-brand-navy font-medium">
                {p.jersey_number && <span className="text-gray-400 font-normal mr-2">#{p.jersey_number}</span>}
                {p.full_name}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-0.5 text-xs">
                {p.email ? (
                  <a href={`mailto:${p.email}`} className="text-brand-red hover:underline break-all">{p.email}</a>
                ) : (
                  <span className="text-gray-300">no email</span>
                )}
                {p.phone ? (
                  <a href={`tel:${p.phone}`} className="text-gray-500 hover:text-brand-navy">{p.phone}</a>
                ) : (
                  <span className="text-gray-300">no phone</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="px-4 lg:px-6 py-4 text-sm text-gray-400">No players on roster.</p>
      )}
    </div>
  )
}

export default function ContactDirectory({ teams }: { teams: Team[] }) {
  if (!teams.length) {
    return <p className="text-gray-400 text-sm">No active teams.</p>
  }

  return (
    <div className="space-y-6">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  )
}
