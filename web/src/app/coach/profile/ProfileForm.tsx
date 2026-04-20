'use client'

import { useActionState } from 'react'

type ActionFn = (prev: string | null, formData: FormData) => Promise<string | null>

export default function ProfileForm({ action, currentName }: { action: ActionFn; currentName: string }) {
  const [error, formAction, isPending] = useActionState(action, null)

  return (
    <form action={formAction} className="space-y-4">
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-600 mb-1">
          Full Name
        </label>
        <input
          name="full_name"
          required
          defaultValue={currentName}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy w-full"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 bg-brand-navy text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-brand-navy-light transition-colors disabled:opacity-50"
      >
        {isPending ? 'Saving…' : 'Save Name'}
      </button>
    </form>
  )
}
