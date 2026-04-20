'use client'

import { useActionState } from 'react'

type ActionFn = (prev: string | null, formData: FormData) => Promise<string | null>

export default function AnnouncementForm({
  action,
  initialTitle = '',
  initialBody = '',
  submitLabel = 'Save Draft',
}: {
  action: ActionFn
  initialTitle?: string
  initialBody?: string
  submitLabel?: string
}) {
  const [error, formAction, isPending] = useActionState(action, null)

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm">{error}</div>
      )}
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
          Title
        </label>
        <input
          name="title"
          defaultValue={initialTitle}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
        />
      </div>
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
          Body
        </label>
        <textarea
          name="body"
          defaultValue={initialBody}
          required
          rows={12}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy resize-y"
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
