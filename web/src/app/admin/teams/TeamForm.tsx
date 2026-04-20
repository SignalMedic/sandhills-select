'use client'

import { useActionState } from 'react'

type ActionFn = (prev: string | null, formData: FormData) => Promise<string | null>

export default function TeamForm({
  action,
  initial = {},
  submitLabel = 'Save',
}: {
  action: ActionFn
  initial?: { name?: string; age_group?: string; season?: string }
  submitLabel?: string
}) {
  const [error, formAction, isPending] = useActionState(action, null)

  return (
    <form action={formAction} className="space-y-5 max-w-md">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm">{error}</div>
      )}
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
          Team Name
        </label>
        <input
          name="name"
          defaultValue={initial.name}
          required
          placeholder="e.g. Sandhills Select 12U"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
        />
      </div>
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
          Age Group
        </label>
        <input
          name="age_group"
          defaultValue={initial.age_group}
          required
          placeholder="e.g. 12U"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
        />
      </div>
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
          Season
        </label>
        <input
          name="season"
          defaultValue={initial.season}
          required
          placeholder="e.g. 2026"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-2 bg-brand-navy text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-brand-navy-light transition-colors disabled:opacity-50"
      >
        {isPending ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}
