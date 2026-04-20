'use client'

import { useActionState } from 'react'

type ActionFn = (prev: string | null, formData: FormData) => Promise<string | null>

export function CoachAssignForm({ action }: { action: ActionFn }) {
  const [error, formAction, isPending] = useActionState(action, null)
  return (
    <form action={formAction} className="flex flex-wrap gap-3 items-end">
      {error && <p className="w-full text-xs text-red-600">{error}</p>}
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-600 mb-1">
          Coach Email
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="coach@email.com"
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy w-56"
        />
      </div>
      <label className="flex items-center gap-2 pb-2 text-sm text-gray-700">
        <input type="checkbox" name="is_head_coach" className="rounded border-gray-300" />
        Head Coach
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 bg-brand-navy text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-brand-navy-light transition-colors disabled:opacity-50"
      >
        {isPending ? 'Adding…' : 'Add Coach'}
      </button>
    </form>
  )
}

export function PlayerAddForm({ action }: { action: ActionFn }) {
  const [error, formAction, isPending] = useActionState(action, null)
  return (
    <form action={formAction} className="flex flex-wrap gap-3 items-end">
      {error && <p className="w-full text-xs text-red-600">{error}</p>}
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-600 mb-1">Full Name</label>
        <input name="full_name" required className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy w-40" />
      </div>
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-600 mb-1">#</label>
        <input name="jersey_number" className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy w-14" />
      </div>
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-600 mb-1">Position</label>
        <input name="position" className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy w-28" />
      </div>
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-600 mb-1">Parent Email</label>
        <input name="email" type="email" className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy w-44" />
      </div>
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-600 mb-1">Phone</label>
        <input name="phone" type="tel" className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy w-32" />
      </div>
      <button type="submit" disabled={isPending} className="px-4 py-2 bg-brand-navy text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-brand-navy-light transition-colors disabled:opacity-50">
        {isPending ? 'Adding…' : 'Add Player'}
      </button>
    </form>
  )
}
