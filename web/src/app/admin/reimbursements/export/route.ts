import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { zipSync } from 'fflate'

function safeName(s: string): string {
  return s
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .slice(0, 40)
}

type Receipt = {
  id: string
  merchant_name: string | null
  amount_cents: number
  expense_date: string
  notes: string | null
  image_url: string | null
  expense_categories: { name: string } | null
}

type ReqProfile = { full_name: string; email: string } | null
type ReqTeam = { name: string } | null

type ReimbRequest = {
  id: string
  title: string
  status: string
  notes: string | null
  created_at: string
  approved_at: string | null
  paid_at: string | null
  profiles: ReqProfile
  teams: ReqTeam
  receipts: Receipt[]
}

export async function GET(req: Request) {
  await requireAdmin()

  const url = new URL(req.url)
  const status = url.searchParams.get('status')
  const teamId = url.searchParams.get('team_id')
  const dateFrom = url.searchParams.get('date_from')
  const dateTo = url.searchParams.get('date_to')

  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase
    .from('reimbursement_requests')
    .select(
      'id, title, status, notes, created_at, approved_at, paid_at, profiles!coach_id(full_name, email), teams(name), receipts(id, merchant_name, amount_cents, expense_date, notes, image_url, expense_categories(name))'
    )
    .order('created_at', { ascending: false })

  if (status && status !== 'all') query = query.eq('status', status)
  if (teamId) query = query.eq('team_id', teamId)
  if (dateFrom) query = query.gte('created_at', dateFrom)
  if (dateTo) query = query.lte('created_at', `${dateTo}T23:59:59`)

  const { data } = await query
  const requests: ReimbRequest[] = data ?? []

  const zipFiles: Record<string, Uint8Array> = {}

  // Download all receipt images in parallel, record their zip paths
  const receiptPaths = new Map<string, string>() // receipt.id -> zip path

  const downloads = requests.flatMap((r) => {
    const teamFolder = safeName(r.teams?.name ?? 'unknown-team')
    const reqFolder = safeName(r.title)

    return (r.receipts ?? [])
      .filter((rec) => rec.image_url)
      .map(async (rec) => {
        const rawUrl = rec.image_url!
        const ext = rawUrl.split('?')[0].split('.').pop() ?? 'bin'
        const merchant = safeName(rec.merchant_name ?? 'receipt')
        const zipPath = `receipts/${teamFolder}/${reqFolder}/${merchant}-${rec.expense_date}.${ext}`
        receiptPaths.set(rec.id, zipPath)

        try {
          const res = await fetch(rawUrl)
          if (res.ok) {
            const buf = await res.arrayBuffer()
            zipFiles[zipPath] = new Uint8Array(buf)
          }
        } catch {
          // skip failed image — path stays in CSV, file just won't be in ZIP
        }
      })
  })

  await Promise.all(downloads)

  // Build CSV (one row per receipt)
  const headers = [
    'Request ID',
    'Coach',
    'Coach Email',
    'Team',
    'Request Title',
    'Request Notes',
    'Status',
    'Submitted',
    'Approved',
    'Paid',
    'Merchant',
    'Category',
    'Receipt Date',
    'Amount',
    'Receipt File',
  ]

  const rows = requests.flatMap((r) => {
    const receipts = r.receipts ?? []

    const base = [
      r.id,
      r.profiles?.full_name ?? '',
      r.profiles?.email ?? '',
      r.teams?.name ?? '',
      r.title,
      r.notes ?? '',
      r.status,
      new Date(r.created_at).toLocaleDateString('en-US'),
      r.approved_at ? new Date(r.approved_at).toLocaleDateString('en-US') : '',
      r.paid_at ? new Date(r.paid_at).toLocaleDateString('en-US') : '',
    ]

    if (receipts.length === 0) {
      return [[...base, '', '', '', '$0.00', '']]
    }

    return receipts.map((rec) => [
      ...base,
      rec.merchant_name ?? '',
      rec.expense_categories?.name ?? '',
      new Date(rec.expense_date).toLocaleDateString('en-US'),
      `$${(rec.amount_cents / 100).toFixed(2)}`,
      receiptPaths.get(rec.id) ?? '',
    ])
  })

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  zipFiles['reimbursements.csv'] = new TextEncoder().encode(csv)

  const zipData = zipSync(zipFiles)

  const now = new Date().toISOString().split('T')[0]
  const suffix = [
    status && status !== 'all' ? status : '',
    teamId ? `team-${teamId.slice(0, 8)}` : '',
    dateFrom ?? '',
    dateTo ? `to-${dateTo}` : '',
  ]
    .filter(Boolean)
    .join('-')

  return new Response(zipData.buffer as ArrayBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="reimbursements-${suffix || 'all'}-${now}.zip"`,
    },
  })
}
