"use client";

import { useActionState, useState } from "react";
import { submitContactForm } from "./actions";

type Team = { id: string; name: string; age_group: string };

const inputClass =
  "w-full border border-gray-300 rounded px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-brand-navy transition-colors";

const labelClass =
  "block text-xs font-display font-bold uppercase tracking-widest text-gray-600 mb-1.5";

export default function ContactForm({ teams }: { teams: Team[] }) {
  const [state, action, pending] = useActionState(submitContactForm, null);
  const [recipientType, setRecipientType] = useState<"admin" | "team">("admin");

  if (state?.success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <p className="font-display font-bold text-green-800 text-xl uppercase mb-2">
          Message Sent!
        </p>
        <p className="text-green-700 text-sm">
          We&apos;ll get back to you at the email you provided.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="sender_name" className={labelClass}>
            Your Name
          </label>
          <input
            id="sender_name"
            name="sender_name"
            type="text"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="sender_email" className={labelClass}>
            Email Address
          </label>
          <input
            id="sender_email"
            name="sender_email"
            type="email"
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Send To</label>
        <div className="flex gap-3">
          {(["admin", "team"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setRecipientType(type)}
              className={`flex-1 py-2.5 text-sm font-display font-bold uppercase tracking-wider rounded border transition-colors ${
                recipientType === type
                  ? "bg-brand-navy text-white border-brand-navy"
                  : "bg-white text-gray-500 border-gray-300 hover:border-brand-navy"
              }`}
            >
              {type === "admin" ? "Organization" : "Specific Team"}
            </button>
          ))}
        </div>
        <input type="hidden" name="recipient_type" value={recipientType} />
      </div>

      {recipientType === "team" && (
        <div>
          <label htmlFor="team_id" className={labelClass}>
            Select Team
          </label>
          <select id="team_id" name="team_id" required className={inputClass}>
            <option value="">Choose a team...</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.age_group})
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="subject" className={labelClass}>
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="body" className={labelClass}>
          Message
        </label>
        <textarea
          id="body"
          name="body"
          rows={5}
          required
          className={inputClass}
        />
      </div>

      {state?.error && (
        <p className="text-sm text-brand-red">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full sm:w-auto px-8 py-3 bg-brand-red text-white font-display font-bold uppercase tracking-wider rounded hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
      >
        {pending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
