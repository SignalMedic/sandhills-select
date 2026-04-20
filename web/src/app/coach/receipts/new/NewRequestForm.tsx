'use client'

import { useActionState } from 'react'

type ActionFn = (prev: string | null, formData: FormData) => Promise<string | null>

export default function NewRequestForm({
  action,
  teams,
}: {
  action: ActionFn
  teams: { id: string; name: string }[]
}) {
  const [error, formAction, isPending] = useActionState(action, null)

  return (
    <form action={formAction} className="space-y-5 max-w-md">
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
          Request Title
        </label>
        <input
          name="title"
          required
          placeholder="e.g. Spring Tournament — Atlanta"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
        />
      </div>

      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
          Notes <span className="normal-case font-normal text-gray-400">(optional)</span>
        </label>
        <textarea
          name="notes"
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy resize-y"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-2 bg-brand-red text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-red-700 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Creating…' : 'Create Request & Add Receipts →'}
      </button>
    </form>
  )
}
