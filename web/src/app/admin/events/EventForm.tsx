'use client'

import { useActionState, useState } from 'react'

type ActionFn = (prev: string | null, formData: FormData) => Promise<string | null>

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type InitialValues = {
  name?: string
  description?: string
  location?: string
  is_recurring?: boolean
  start_date?: string
  end_date?: string
  recurrence_days?: number[] | null
  recurrence_time?: string | null
  recurrence_end_time?: string | null
  age_groups?: string[]
  registration_open?: boolean
  registration_deadline?: string | null
  price_cents?: number
  max_registrations?: number | null
  waiver_text?: string | null
}

function toDatetimeLocal(iso: string | null | undefined) {
  if (!iso) return ''
  return iso.slice(0, 16)
}

function toDateOnly(iso: string | null | undefined) {
  if (!iso) return ''
  return iso.slice(0, 10)
}

function toTimeOnly(t: string | null | undefined) {
  if (!t) return ''
  return t.slice(0, 5)
}

const inputClass = 'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy'
const labelClass = 'block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2'

export default function EventForm({
  action,
  initial = {},
  submitLabel = 'Save Draft',
}: {
  action: ActionFn
  initial?: InitialValues
  submitLabel?: string
}) {
  const [error, formAction, isPending] = useActionState(action, null)
  const [isRecurring, setIsRecurring] = useState(initial.is_recurring ?? false)
  const [selectedDays, setSelectedDays] = useState<number[]>(initial.recurrence_days ?? [])

  function toggleDay(day: number) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    )
  }

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Name */}
        <div className="col-span-2">
          <label className={labelClass}>Event Name</label>
          <input name="name" defaultValue={initial.name} required className={inputClass} />
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            defaultValue={initial.description ?? ''}
            rows={4}
            className={`${inputClass} resize-y`}
          />
        </div>

        {/* Location */}
        <div className="col-span-2">
          <label className={labelClass}>Location</label>
          <input name="location" defaultValue={initial.location} required className={inputClass} />
        </div>

        {/* Schedule type toggle */}
        <div className="col-span-2">
          <label className={labelClass}>Schedule Type</label>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden w-fit">
            <button
              type="button"
              onClick={() => setIsRecurring(false)}
              className={`px-4 py-2 text-xs font-display font-bold uppercase tracking-wider transition-colors ${
                !isRecurring ? 'bg-brand-navy text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              One-time
            </button>
            <button
              type="button"
              onClick={() => setIsRecurring(true)}
              className={`px-4 py-2 text-xs font-display font-bold uppercase tracking-wider transition-colors border-l border-gray-300 ${
                isRecurring ? 'bg-brand-navy text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              Recurring
            </button>
          </div>
          <input type="hidden" name="is_recurring" value={isRecurring ? 'true' : 'false'} />
        </div>

        {/* One-time: start + end datetime */}
        {!isRecurring && (
          <>
            <div>
              <label className={labelClass}>Start Date &amp; Time</label>
              <input
                type="datetime-local"
                name="start_date"
                defaultValue={toDatetimeLocal(initial.start_date)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>End Date &amp; Time</label>
              <input
                type="datetime-local"
                name="end_date"
                defaultValue={toDatetimeLocal(initial.end_date)}
                required
                className={inputClass}
              />
            </div>
          </>
        )}

        {/* Recurring: season range + days + time */}
        {isRecurring && (
          <>
            <div>
              <label className={labelClass}>Event Start</label>
              <input
                type="date"
                name="start_date"
                defaultValue={toDateOnly(initial.start_date)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Event End</label>
              <input
                type="date"
                name="end_date"
                defaultValue={toDateOnly(initial.end_date)}
                required
                className={inputClass}
              />
            </div>

            <div className="col-span-2">
              <label className={labelClass}>Repeats On</label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day, i) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(i)}
                    className={`w-12 py-2 text-xs font-display font-bold uppercase rounded border transition-colors ${
                      selectedDays.includes(i)
                        ? 'bg-brand-navy text-white border-brand-navy'
                        : 'bg-white text-gray-500 border-gray-300 hover:border-brand-navy'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              {/* Hidden inputs for selected days */}
              {selectedDays.map((d) => (
                <input key={d} type="hidden" name="recurrence_days" value={d} />
              ))}
              {selectedDays.length === 0 && (
                <p className="text-xs text-red-500 mt-1">Select at least one day.</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Start Time</label>
              <input
                type="time"
                name="recurrence_time"
                defaultValue={toTimeOnly(initial.recurrence_time)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>End Time</label>
              <input
                type="time"
                name="recurrence_end_time"
                defaultValue={toTimeOnly(initial.recurrence_end_time)}
                className={inputClass}
              />
            </div>
          </>
        )}

        {/* Age Groups */}
        <div className="col-span-2">
          <label className={labelClass}>
            Age Groups <span className="normal-case font-normal text-gray-400">(comma-separated, e.g. 10U, 12U, 14U)</span>
          </label>
          <input
            name="age_groups"
            defaultValue={initial.age_groups?.join(', ') ?? ''}
            className={inputClass}
          />
        </div>

        {/* Price */}
        <div>
          <label className={labelClass}>Price (dollars)</label>
          <input
            type="number"
            name="price"
            step="0.01"
            min="0"
            defaultValue={((initial.price_cents ?? 0) / 100).toFixed(2)}
            className={inputClass}
          />
        </div>

        {/* Max Registrations */}
        <div>
          <label className={labelClass}>
            Max Registrations <span className="normal-case font-normal text-gray-400">(blank = unlimited)</span>
          </label>
          <input
            type="number"
            name="max_registrations"
            min="1"
            defaultValue={initial.max_registrations ?? ''}
            className={inputClass}
          />
        </div>

        {/* Registration Deadline */}
        <div>
          <label className={labelClass}>Registration Deadline</label>
          <input
            type="datetime-local"
            name="registration_deadline"
            defaultValue={toDatetimeLocal(initial.registration_deadline)}
            className={inputClass}
          />
        </div>

        {/* Registration Open */}
        <div className="flex items-center gap-3 pt-6">
          <input
            type="checkbox"
            name="registration_open"
            id="registration_open"
            defaultChecked={initial.registration_open ?? false}
            className="rounded border-gray-300"
          />
          <label htmlFor="registration_open" className="text-sm font-display font-bold uppercase tracking-wider text-gray-700">
            Registration Open
          </label>
        </div>

        {/* Waiver */}
        <div className="col-span-2">
          <label className={labelClass}>
            Waiver / Liability Release <span className="normal-case font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            name="waiver_text"
            defaultValue={initial.waiver_text ?? ''}
            rows={6}
            placeholder="By registering for this event, I acknowledge and agree to the following terms..."
            className={`${inputClass} resize-y`}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-2 bg-brand-navy text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-brand-navy-light transition-colors disabled:opacity-50"
      >
        {isPending ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}
