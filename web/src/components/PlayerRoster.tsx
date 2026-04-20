'use client'

import { useActionState, useState } from 'react'

type Player = {
  id: string
  full_name: string
  jersey_number: string | null
  position: string | null
  email: string | null
  phone: string | null
}

type ActionFn = (prev: string | null, formData: FormData) => Promise<string | null>

const inputClass = "border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy w-full"

function PlayerFields({ defaults }: { defaults?: Player }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <div className="sm:col-span-2 lg:col-span-1">
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-600 mb-1">Full Name</label>
        <input name="full_name" defaultValue={defaults?.full_name} required className={inputClass} />
      </div>
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-600 mb-1">#</label>
        <input name="jersey_number" defaultValue={defaults?.jersey_number ?? ''} className={inputClass} />
      </div>
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-600 mb-1">Position</label>
        <input name="position" defaultValue={defaults?.position ?? ''} className={inputClass} />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-600 mb-1">Parent Email</label>
        <input name="email" type="email" defaultValue={defaults?.email ?? ''} className={inputClass} />
      </div>
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-600 mb-1">Phone</label>
        <input name="phone" type="tel" defaultValue={defaults?.phone ?? ''} className={inputClass} />
      </div>
    </div>
  )
}

function EditRow({
  player,
  editAction,
  removeAction,
  onClose,
}: {
  player: Player
  editAction: ActionFn
  removeAction: () => Promise<void>
  onClose: () => void
}) {
  const [error, formAction, isPending] = useActionState(
    async (prev: string | null, formData: FormData) => {
      const result = await editAction(prev, formData)
      if (!result) onClose()
      return result
    },
    null
  )
  const [removing, setRemoving] = useState(false)

  async function handleRemove() {
    if (!confirm(`Remove ${player.full_name} from the roster?`)) return
    setRemoving(true)
    await removeAction()
  }

  return (
    <div className="px-4 py-4 bg-gray-50 border-t border-gray-100">
      <form action={formAction} className="space-y-3">
        {error && <p className="text-xs text-red-600">{error}</p>}
        <PlayerFields defaults={player} />
        <div className="flex flex-wrap gap-2 pt-1">
          <button type="submit" disabled={isPending} className="px-3 py-1.5 bg-brand-navy text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-brand-navy-light transition-colors disabled:opacity-50">
            {isPending ? 'Saving…' : 'Save'}
          </button>
          <button type="button" onClick={onClose} className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs font-display font-bold uppercase tracking-wider rounded hover:border-gray-400 transition-colors">
            Cancel
          </button>
          <button type="button" onClick={handleRemove} disabled={removing} className="px-3 py-1.5 bg-red-600 text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-red-700 transition-colors disabled:opacity-50">
            {removing ? 'Removing…' : 'Remove'}
          </button>
        </div>
      </form>
    </div>
  )
}

function AddRow({ addAction }: { addAction: ActionFn }) {
  const [error, formAction, isPending] = useActionState(addAction, null)
  return (
    <div className="px-4 py-4 bg-blue-50 border-t border-blue-100">
      <p className="text-xs font-display font-bold uppercase tracking-wider text-gray-500 mb-3">Add Player</p>
      <form action={formAction} className="space-y-3">
        {error && <p className="text-xs text-red-600">{error}</p>}
        <PlayerFields />
        <button type="submit" disabled={isPending} className="px-4 py-1.5 bg-brand-navy text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-brand-navy-light transition-colors disabled:opacity-50">
          {isPending ? 'Adding…' : '+ Add Player'}
        </button>
      </form>
    </div>
  )
}

export default function PlayerRoster({
  players,
  addAction,
  makeEditAction,
  makeRemoveAction,
}: {
  players: Player[]
  addAction: ActionFn
  makeEditAction: (playerId: string) => ActionFn
  makeRemoveAction: (playerId: string) => () => Promise<void>
}) {
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {players.length === 0 && (
        <p className="px-5 py-4 text-sm text-gray-400">No players yet.</p>
      )}
      {players.map((p) => (
        <div key={p.id} className="border-b border-gray-100 last:border-0">
          <div className="flex items-start justify-between px-4 py-3 gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-brand-navy">
                {p.jersey_number && <span className="text-gray-400 font-normal mr-2">#{p.jersey_number}</span>}
                {p.full_name}
                {p.position && <span className="text-xs text-gray-400 ml-2">{p.position}</span>}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-0.5">
                {p.email && (
                  <a href={`mailto:${p.email}`} className="text-xs text-brand-red hover:underline truncate max-w-[200px]">{p.email}</a>
                )}
                {p.phone && (
                  <a href={`tel:${p.phone}`} className="text-xs text-gray-500 hover:text-brand-navy">{p.phone}</a>
                )}
              </div>
            </div>
            <button
              onClick={() => setEditingId(editingId === p.id ? null : p.id)}
              className="text-xs font-display font-bold uppercase text-gray-400 hover:text-brand-navy transition-colors shrink-0"
            >
              {editingId === p.id ? 'Cancel' : 'Edit'}
            </button>
          </div>
          {editingId === p.id && (
            <EditRow
              player={p}
              editAction={makeEditAction(p.id)}
              removeAction={makeRemoveAction(p.id)}
              onClose={() => setEditingId(null)}
            />
          )}
        </div>
      ))}
      <AddRow addAction={addAction} />
    </div>
  )
}
