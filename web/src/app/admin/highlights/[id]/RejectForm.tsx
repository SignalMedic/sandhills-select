'use client'

import { useActionState } from 'react'

type ActionFn = (prev: string | null, formData: FormData) => Promise<string | null>

export default function RejectForm({ action }: { action: ActionFn }) {
  const [error, formAction, isPending] = useActionState(action, null)

  return (
    <form action={formAction} className="space-y-3">
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
          Rejection Reason
        </label>
        <textarea
          name="rejection_reason"
          required
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy resize-y"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 bg-red-600 text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-red-700 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Rejecting…' : 'Reject Highlight'}
      </button>
    </form>
  )
}
