'use client'

import { useActionState } from 'react'
import { useState } from 'react'

type ActionFn = (prev: string | null, formData: FormData) => Promise<string | null>

export default function StatusForm({
  action,
  currentStatus,
}: {
  action: ActionFn
  currentStatus: string
}) {
  const [error, formAction, isPending] = useActionState(action, null)
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)

  return (
    <form action={formAction} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm">{error}</div>
      )}

      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
          Status
        </label>
        <select
          name="status"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
        >
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {selectedStatus === 'denied' && (
        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
            Denial Reason
          </label>
          <textarea
            name="denial_reason"
            required
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy resize-y"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="px-5 py-2 bg-brand-navy text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-brand-navy-light transition-colors disabled:opacity-50"
      >
        {isPending ? 'Saving…' : 'Update Status'}
      </button>
    </form>
  )
}
