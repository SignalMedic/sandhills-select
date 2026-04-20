'use client'

import { useTransition } from 'react'

export default function DeleteButton({
  action,
  label = 'Delete',
  confirmMessage = 'Delete this? This cannot be undone.',
}: {
  action: () => Promise<void>
  label?: string
  confirmMessage?: string
}) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm(confirmMessage)) return
    startTransition(() => action())
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="px-3 py-1.5 bg-red-600 text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-red-700 transition-colors disabled:opacity-50"
    >
      {isPending ? 'Deleting…' : label}
    </button>
  )
}
