"use client";

import { useActionState } from "react";
import { submitRegistration } from "./actions";

function formatPrice(cents: number) {
  if (cents === 0) return "Free";
  return `$${(cents / 100).toFixed(0)}`;
}

export type RegistrationEvent = {
  id: string;
  name: string;
  age_groups: string[] | null;
  price_cents: number;
  waiver_text: string | null;
};

export default function RegistrationForm({ event }: { event: RegistrationEvent }) {
  const boundAction = submitRegistration.bind(null, event.id);
  const [error, formAction, isPending] = useActionState(boundAction, null);

  return (
    <form action={formAction} className="space-y-10">
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-5 py-4 text-sm">
          {error}
        </div>
      )}

      {/* Player Info */}
      <section>
        <h2 className="font-display font-bold text-brand-navy text-lg uppercase tracking-wide mb-4 pb-2 border-b border-gray-200">
          Player Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1">
              Player Full Name <span className="text-brand-red">*</span>
            </label>
            <input
              name="player_name"
              required
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
            />
          </div>
          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="player_dob"
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
            />
          </div>
          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1">
              Position
            </label>
            <input
              name="position"
              placeholder="e.g. Pitcher, Catcher, SS"
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
            />
          </div>
          {event.age_groups && event.age_groups.length > 0 && (
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1">
                Age Group <span className="text-brand-red">*</span>
              </label>
              <select
                name="age_group"
                required
                className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy bg-white"
              >
                <option value="">Select…</option>
                {event.age_groups.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </section>

      {/* Parent/Guardian Info */}
      <section>
        <h2 className="font-display font-bold text-brand-navy text-lg uppercase tracking-wide mb-4 pb-2 border-b border-gray-200">
          Parent / Guardian Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1">
              Full Name <span className="text-brand-red">*</span>
            </label>
            <input
              name="registrant_name"
              required
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
            />
          </div>
          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1">
              Email Address <span className="text-brand-red">*</span>
            </label>
            <input
              type="email"
              name="registrant_email"
              required
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
            />
          </div>
          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="registrant_phone"
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1">
              Notes / Special Requests <span className="normal-case font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              name="notes"
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy resize-y"
            />
          </div>
        </div>
      </section>

      {/* Waiver */}
      {event.waiver_text && (
        <section>
          <h2 className="font-display font-bold text-brand-navy text-lg uppercase tracking-wide mb-4 pb-2 border-b border-gray-200">
            Liability Waiver
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto mb-4">
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{event.waiver_text}</p>
          </div>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="waiver_accepted"
                required
                className="mt-0.5 rounded border-gray-300 focus:ring-brand-navy"
              />
              <span className="text-sm text-gray-700">
                I have read and agree to the waiver and liability release above on behalf of my child.
              </span>
            </label>
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1">
                Type Your Full Name to Sign <span className="text-brand-red">*</span>
              </label>
              <input
                name="waiver_signature"
                required
                placeholder="Full name"
                className="w-full sm:w-80 border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
              />
            </div>
          </div>
        </section>
      )}

      {/* Summary & Submit */}
      <section className="bg-brand-navy rounded-lg p-6 text-white">
        <h2 className="font-display font-bold uppercase tracking-wide mb-4">Registration Summary</h2>
        <div className="flex items-center justify-between mb-6">
          <span className="text-blue-200 text-sm">{event.name}</span>
          <span className="font-display font-bold text-xl">{formatPrice(event.price_cents)}</span>
        </div>
        {event.price_cents > 0 && (
          <p className="text-blue-300 text-xs mb-4">
            Payment instructions will be sent to your email after registration is submitted.
          </p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 bg-brand-red text-white font-display font-bold uppercase tracking-wider rounded hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {isPending
            ? "Submitting…"
            : event.price_cents === 0
            ? "Complete Registration — Free"
            : `Complete Registration — ${formatPrice(event.price_cents)}`}
        </button>
      </section>
    </form>
  );
}
