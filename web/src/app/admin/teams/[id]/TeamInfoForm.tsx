'use client'

import { useActionState } from 'react'

type ActionFn = (prev: string | null, formData: FormData) => Promise<string | null>

export default function TeamInfoForm({
  action,
  initial,
}: {
  action: ActionFn
  initial: { name: string; age_group: string; season: string }
}) {
  const [error, formAction, isPending] = useActionState(action, null)

  return (
    <form action={formAction} className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-600 mb-1">Name</label>
          <input name="name" defaultValue={initial.name} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy" />
        </div>
        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-600 mb-1">Age Group</label>
          <input name="age_group" defaultValue={initial.age_group} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy" />
        </div>
        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-600 mb-1">Season</label>
          <input name="season" defaultValue={initial.season} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy" />
        </div>
      </div>
      <button type="submit" disabled={isPending} className="px-5 py-2 bg-brand-navy text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-brand-navy-light transition-colors disabled:opacity-50">
        {isPending ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  )
}
