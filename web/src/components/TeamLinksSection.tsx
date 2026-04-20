'use client'

import { useActionState, useTransition } from 'react'

type Link = { id: string; label: string; url: string }
type AddAction = (prev: string | null, formData: FormData) => Promise<string | null>
type RemoveAction = (linkId: string) => Promise<void>

export default function TeamLinksSection({
  links,
  addAction,
  removeAction,
}: {
  links: Link[]
  addAction: AddAction
  removeAction: RemoveAction
}) {
  const [error, formAction, isPending] = useActionState(addAction, null)

  return (
    <div>
      {links.length > 0 && (
        <div className="divide-y divide-gray-100 mb-6 border border-gray-200 rounded-lg overflow-hidden">
          {links.map((link) => (
            <LinkRow key={link.id} link={link} removeAction={removeAction} />
          ))}
        </div>
      )}
      {links.length === 0 && (
        <p className="text-sm text-gray-400 mb-6">No links added yet.</p>
      )}

      <p className="text-xs font-display font-bold uppercase tracking-wider text-gray-500 mb-3">Add Link</p>
      <form action={formAction} className="flex flex-wrap gap-3 items-end">
        {error && <p className="w-full text-xs text-red-600">{error}</p>}
        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-600 mb-1">Label</label>
          <input
            name="label"
            required
            placeholder="Team Website"
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy w-44"
          />
        </div>
        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-600 mb-1">URL</label>
          <input
            name="url"
            type="url"
            required
            placeholder="https://..."
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy w-72"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-brand-navy text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-brand-navy-light transition-colors disabled:opacity-50"
        >
          {isPending ? 'Adding…' : 'Add Link'}
        </button>
      </form>
    </div>
  )
}

function LinkRow({ link, removeAction }: { link: Link; removeAction: RemoveAction }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex items-center justify-between px-4 py-3 gap-2">
      <div>
        <p className="text-sm font-semibold text-brand-navy">{link.label}</p>
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate max-w-xs block">
          {link.url}
        </a>
      </div>
      <button
        onClick={() => {
          if (!confirm(`Remove link "${link.label}"?`)) return
          startTransition(() => removeAction(link.id))
        }}
        disabled={isPending}
        className="px-3 py-1.5 bg-red-600 text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-red-700 transition-colors disabled:opacity-50 shrink-0"
      >
        {isPending ? 'Removing…' : 'Remove'}
      </button>
    </div>
  )
}
