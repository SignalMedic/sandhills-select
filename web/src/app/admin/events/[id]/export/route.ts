import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const supabase = await createClient()

  const [{ data: event }, { data: registrations }] = await Promise.all([
    supabase.from('events').select('name').eq('id', id).single(),
    supabase
      .from('event_registrations')
      .select('player_name, player_dob, position, age_group, registrant_name, registrant_email, registrant_phone, payment_status, amount_paid_cents, notes, created_at')
      .eq('event_id', id)
      .order('created_at'),
  ])

  const rows = (registrations ?? []).map((r) => [
    r.player_name,
    r.player_dob ?? '',
    r.position ?? '',
    r.age_group ?? '',
    r.registrant_name,
    r.registrant_email,
    r.registrant_phone ?? '',
    r.payment_status,
    r.amount_paid_cents ? `$${(r.amount_paid_cents / 100).toFixed(2)}` : '$0.00',
    r.notes ?? '',
    new Date(r.created_at).toLocaleDateString('en-US'),
  ])

  const headers = ['Player Name', 'DOB', 'Position', 'Age Group', 'Parent Name', 'Email', 'Phone', 'Payment Status', 'Amount Paid', 'Notes', 'Registered At']
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const slug = (event?.name ?? id).replace(/\s+/g, '-').toLowerCase()
  const filename = `registrations-${slug}.csv`

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
