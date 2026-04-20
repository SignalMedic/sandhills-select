'use server'

import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function parseEventFormData(formData: FormData) {
  const priceStr = formData.get('price') as string
  const priceCents = Math.round(parseFloat(priceStr || '0') * 100)

  const ageGroupsRaw = formData.get('age_groups') as string
  const ageGroups = ageGroupsRaw.split(',').map((s) => s.trim()).filter(Boolean)

  const maxReg = formData.get('max_registrations') as string
  const regDeadline = formData.get('registration_deadline') as string
  const isRecurring = formData.get('is_recurring') === 'true'

  // For recurring events, start_date/end_date are date-only inputs — normalise to ISO
  const startRaw = formData.get('start_date') as string
  const endRaw = formData.get('end_date') as string
  const startDate = isRecurring && startRaw.length === 10 ? `${startRaw}T00:00:00` : startRaw
  const endDate = isRecurring && endRaw.length === 10 ? `${endRaw}T23:59:59` : endRaw

  const recurrenceDays = isRecurring
    ? formData.getAll('recurrence_days').map((v) => parseInt(v as string))
    : null
  const recurrenceTime = isRecurring ? (formData.get('recurrence_time') as string) || null : null
  const recurrenceEndTime = isRecurring ? (formData.get('recurrence_end_time') as string) || null : null

  return {
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || null,
    location: formData.get('location') as string,
    is_recurring: isRecurring,
    start_date: startDate,
    end_date: endDate,
    recurrence_days: recurrenceDays,
    recurrence_time: recurrenceTime,
    recurrence_end_time: recurrenceEndTime,
    age_groups: ageGroups,
    registration_open: formData.get('registration_open') === 'on',
    registration_deadline: regDeadline || null,
    price_cents: priceCents,
    max_registrations: maxReg ? parseInt(maxReg) : null,
    waiver_text: (formData.get('waiver_text') as string) || null,
  }
}

export async function createEvent(_prev: string | null, formData: FormData): Promise<string | null> {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase.from('events').insert(parseEventFormData(formData))
  if (error) return error.message
  revalidatePath('/admin/events')
  redirect('/admin/events')
}

export async function updateEvent(id: string, _prev: string | null, formData: FormData): Promise<string | null> {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('events')
    .update(parseEventFormData(formData))
    .eq('id', id)

  if (error) return error.message
  revalidatePath('/admin/events')
  redirect('/admin/events')
}

export async function toggleEventPublish(id: string, currentStatus: string): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('events')
    .update({ status: currentStatus === 'published' ? 'draft' : 'published' })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/events')
  revalidatePath(`/admin/events/${id}`)
}

export async function toggleEventRegistration(id: string, currentOpen: boolean): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('events')
    .update({ registration_open: !currentOpen })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/events')
  revalidatePath(`/admin/events/${id}`)
}

export async function markRegistrationPaid(eventId: string, registrationId: string): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('event_registrations')
    .update({ payment_status: 'paid' })
    .eq('id', registrationId)

  if (error) throw new Error(error.message)
  revalidatePath(`/admin/events/${eventId}`)
}

export async function removeRegistration(eventId: string, registrationId: string): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('event_registrations')
    .delete()
    .eq('id', registrationId)

  if (error) throw new Error(error.message)
  revalidatePath(`/admin/events/${eventId}`)
}

export async function deleteEvent(id: string): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/events')
  redirect('/admin/events')
}
