'use client'

import { useActionState, useState } from 'react'

type ActionFn = (prev: string | null, formData: FormData) => Promise<string | null>

export default function HighlightForm({
  action,
  teams,
}: {
  action: ActionFn
  teams: { id: string; name: string }[]
}) {
  const [error, formAction, isPending] = useActionState(action, null)
  const [type, setType] = useState('text')

  return (
    <form action={formAction} className="space-y-5 max-w-lg">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm">{error}</div>
      )}

      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
          Team
        </label>
        <select
          name="team_id"
          required
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
        >
          <option value="">Select team…</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
          Type
        </label>
        <div className="flex gap-2">
          {['text', 'photo', 'video'].map((t) => (
            <label
              key={t}
              className={`flex-1 text-center px-3 py-2 text-xs font-display font-bold uppercase tracking-wider rounded border cursor-pointer transition-colors ${
                type === t
                  ? 'bg-brand-navy text-white border-brand-navy'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-brand-navy'
              }`}
            >
              <input
                type="radio"
                name="type"
                value={t}
                checked={type === t}
                onChange={() => setType(t)}
                className="sr-only"
              />
              {t}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
          Caption
        </label>
        <textarea
          name="caption"
          required
          rows={4}
          placeholder="Describe the highlight…"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy resize-y"
        />
      </div>

      {(type === 'photo' || type === 'video') && (
        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
            Media URL <span className="normal-case font-normal text-gray-400">(link to photo or video)</span>
          </label>
          <input
            name="media_url"
            type="url"
            placeholder="https://…"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-2 bg-brand-red text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-red-700 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Submitting…' : 'Submit for Review'}
      </button>
    </form>
  )
}
