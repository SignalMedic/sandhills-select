'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const STATUS_TABS = ['all', 'under_review', 'approved', 'paid', 'denied'] as const

export default function FiltersBar({ teams }: { teams: { id: string; name: string }[] }) {
  const router = useRouter()
  const sp = useSearchParams()

  function update(key: string, value: string) {
    const next = new URLSearchParams(sp.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    router.push(`/admin/reimbursements?${next.toString()}`)
  }

  const activeTab = sp.get('status') ?? 'under_review'
  const teamId = sp.get('team_id') ?? ''
  const dateFrom = sp.get('date_from') ?? ''
  const dateTo = sp.get('date_to') ?? ''
  const hasExtra = !!(teamId || dateFrom || dateTo)

  return (
    <div className="space-y-3 mb-6">
      <div className="flex flex-wrap gap-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => update('status', tab)}
            className={`px-3 py-1.5 text-xs font-display font-bold uppercase tracking-wider rounded transition-colors ${
              activeTab === tab
                ? 'bg-brand-navy text-white'
                : 'bg-white border border-gray-200 text-gray-500 hover:text-brand-navy'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={teamId}
          onChange={(e) => update('team_id', e.target.value)}
          className="text-xs border border-gray-200 rounded px-2 py-1.5 text-brand-navy bg-white focus:outline-none focus:ring-1 focus:ring-brand-navy"
        >
          <option value="">All Teams</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-display font-bold uppercase tracking-wider">From</span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => update('date_from', e.target.value)}
            className="text-xs border border-gray-200 rounded px-2 py-1.5 text-brand-navy bg-white focus:outline-none focus:ring-1 focus:ring-brand-navy"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-display font-bold uppercase tracking-wider">To</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => update('date_to', e.target.value)}
            className="text-xs border border-gray-200 rounded px-2 py-1.5 text-brand-navy bg-white focus:outline-none focus:ring-1 focus:ring-brand-navy"
          />
        </div>

        {hasExtra && (
          <button
            onClick={() => {
              const next = new URLSearchParams()
              if (sp.get('status')) next.set('status', sp.get('status')!)
              router.push(`/admin/reimbursements?${next.toString()}`)
            }}
            className="text-xs text-gray-400 hover:text-brand-red font-display font-bold uppercase tracking-wider transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  )
}
