'use client'

import { useActionState } from 'react'

type Team = { id: string; name: string; age_group: string }
type ActionFn = (prev: string | null, formData: FormData) => Promise<string | null>

export default function ScheduleForm({
  action,
  teams,
}: {
  action: ActionFn
  teams: Team[]
}) {
  const [error, formAction, isPending] = useActionState(action, null)

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <option key={t.id} value={t.id}>
                {t.name} ({t.age_group})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
            Type
          </label>
          <select
            name="type"
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
          >
            <option value="game">Game</option>
            <option value="practice">Practice</option>
            <option value="scrimmage">Scrimmage</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
            Opponent <span className="normal-case font-normal text-gray-400">(games only)</span>
          </label>
          <input
            name="opponent"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
            Location
          </label>
          <input
            name="location"
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
          />
        </div>

        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
            Start
          </label>
          <input
            type="datetime-local"
            name="starts_at"
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
          />
        </div>

        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
            End
          </label>
          <input
            type="datetime-local"
            name="ends_at"
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy resize-y"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-2 bg-brand-navy text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-brand-navy-light transition-colors disabled:opacity-50"
      >
        {isPending ? 'Saving…' : 'Add to Schedule'}
      </button>
    </form>
  )
}
