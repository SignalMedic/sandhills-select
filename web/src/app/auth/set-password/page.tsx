"use client";

import { useActionState } from "react";
import Image from "next/image";
import { setPassword } from "./actions";

export default function SetPasswordPage() {
  const [error, formAction, isPending] = useActionState(setPassword, null);

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Image src="/logo.png" alt="Sandhills Select" width={72} height={72} unoptimized />
        </div>

        <h1 className="font-display font-bold text-white text-2xl uppercase text-center mb-2">
          Set Your Password
        </h1>
        <p className="text-blue-300 text-sm text-center mb-8">
          Choose a password to complete your account setup.
        </p>

        <form action={formAction} className="space-y-4">
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 rounded px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-blue-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              className="w-full bg-white/10 border border-white/20 rounded px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>

          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-blue-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm"
              required
              minLength={8}
              className="w-full bg-white/10 border border-white/20 rounded px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-brand-red text-white font-display font-bold uppercase tracking-wider rounded hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isPending ? "Setting password…" : "Set Password & Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
