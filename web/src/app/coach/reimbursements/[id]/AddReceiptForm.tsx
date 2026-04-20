'use client'

import { useActionState } from 'react'

type ActionFn = (prev: string | null, formData: FormData) => Promise<string | null>
type Category = { id: number; name: string }

export default function AddReceiptForm({
  action,
  categories,
}: {
  action: ActionFn
  categories: Category[]
}) {
  const [error, formAction, isPending] = useActionState(action, null)

  return (
    <form action={formAction} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-1">
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1">
            Merchant
          </label>
          <input
            name="merchant_name"
            placeholder="e.g. McDonald's"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
          />
        </div>

        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1">
            Amount ($)
          </label>
          <input
            type="number"
            name="amount"
            step="0.01"
            min="0.01"
            required
            placeholder="0.00"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
          />
        </div>

        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category_id"
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
          >
            <option value="">Select…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            name="expense_date"
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1">
            Receipt File <span className="normal-case font-normal text-gray-400">(photo or PDF — max 10 MB)</span>
          </label>
          <input
            type="file"
            name="receipt_file"
            accept="image/jpeg,image/png,image/webp,image/heic,application/pdf"
            className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-xs file:font-display file:font-bold file:uppercase file:tracking-wider file:bg-brand-navy file:text-white hover:file:bg-brand-navy-light"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1">
            Notes <span className="normal-case font-normal text-gray-400">(optional)</span>
          </label>
          <input
            name="notes"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="px-5 py-2 bg-brand-navy text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-brand-navy-light transition-colors disabled:opacity-50"
      >
        {isPending ? 'Adding…' : '+ Add Receipt'}
      </button>
    </form>
  )
}
