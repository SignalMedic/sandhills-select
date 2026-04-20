'use client'

import { useTransition } from 'react'

export type Registration = {
  id: string
  player_name: string
  player_dob: string | null
  position: string | null
  age_group: string | null
  registrant_name: string
  registrant_email: string
  registrant_phone: string | null
  payment_status: string
  amount_paid_cents: number
  notes: string | null
  created_at: string
}

function RegistrationRow({
  r,
  markPaid,
  remove,
}: {
  r: Registration
  markPaid: (id: string) => Promise<void>
  remove: (id: string) => Promise<void>
}) {
  const [isPaying, startPay] = useTransition()
  const [isRemoving, startRemove] = useTransition()

  return (
    <div className="px-6 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <p className="text-sm font-semibold text-brand-navy">{r.player_name}</p>
            {r.age_group && (
              <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{r.age_group}</span>
            )}
          </div>
          {(r.position || r.player_dob) && (
            <p className="text-xs text-gray-500">{[r.position, r.player_dob].filter(Boolean).join(' · ')}</p>
          )}
          <p className="text-xs text-gray-500 mt-0.5">
            {r.registrant_name} · {r.registrant_email}
            {r.registrant_phone && ` · ${r.registrant_phone}`}
          </p>
          {r.notes && <p className="text-xs text-gray-400 mt-0.5 italic">{r.notes}</p>}
          <p className="text-xs text-gray-300 mt-1">{new Date(r.created_at).toLocaleDateString()}</p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`text-xs font-display font-bold uppercase px-2 py-0.5 rounded ${
            r.payment_status === 'paid'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {r.payment_status === 'paid'
              ? r.amount_paid_cents > 0 ? `Paid $${(r.amount_paid_cents / 100).toFixed(2)}` : 'Paid'
              : 'Pending'}
          </span>
          <div className="flex gap-2">
            {r.payment_status !== 'paid' && (
              <button
                onClick={() => startPay(() => markPaid(r.id))}
                disabled={isPaying}
                className="text-xs font-display font-bold uppercase px-2.5 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isPaying ? 'Saving…' : 'Mark Paid'}
              </button>
            )}
            <button
              onClick={() => {
                if (!confirm(`Remove registration for ${r.player_name}? This cannot be undone.`)) return
                startRemove(() => remove(r.id))
              }}
              disabled={isRemoving}
              className="text-xs font-display font-bold uppercase px-2.5 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isRemoving ? '…' : 'Remove'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegistrationsTable({
  registrations,
  exportHref,
  markPaid,
  remove,
}: {
  registrations: Registration[]
  exportHref: string
  markPaid: (registrationId: string) => Promise<void>
  remove: (registrationId: string) => Promise<void>
}) {
  const paidCount = registrations.filter((r) => r.payment_status === 'paid').length

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-bold text-brand-navy text-xl uppercase">
            Registrations ({registrations.length})
          </h2>
          {registrations.length > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">
              {paidCount} paid · {registrations.length - paidCount} pending
            </p>
          )}
        </div>
        {registrations.length > 0 && (
          <a
            href={exportHref}
            className="text-xs font-display font-bold uppercase text-brand-navy hover:text-brand-red transition-colors"
          >
            Export CSV ↓
          </a>
        )}
      </div>
      {registrations.length === 0 ? (
        <p className="text-sm text-gray-400">No registrations yet.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {registrations.map((r) => (
            <RegistrationRow key={r.id} r={r} markPaid={markPaid} remove={remove} />
          ))}
        </div>
      )}
    </div>
  )
}
