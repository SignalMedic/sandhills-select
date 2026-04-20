"use client";

import { useActionState } from "react";
import { signIn } from "./actions";
import Image from "next/image";

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, null);

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo.png"
            alt="Sandhills Select Baseball"
            width={80}
            height={80}
            className="rounded mb-4"
            unoptimized
          />
          <h1 className="font-display font-bold text-white text-2xl uppercase tracking-wide">
            Sandhills Select
          </h1>
          <p className="text-blue-200 text-sm tracking-widest uppercase mt-1">
            Staff Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg p-8 shadow-2xl">
          <h2 className="font-display font-bold text-brand-navy text-xl uppercase mb-6">
            Sign In
          </h2>

          <form action={action} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-display font-bold uppercase tracking-widest text-gray-500 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-navy transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-display font-bold uppercase tracking-widest text-gray-500 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-navy transition-colors"
              />
            </div>

            {state?.error && (
              <p className="text-sm text-brand-red">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 bg-brand-red text-white font-display font-bold uppercase tracking-wider rounded hover:bg-red-700 transition-colors disabled:opacity-50 text-sm mt-2"
            >
              {pending ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-blue-300 text-xs mt-6">
          Staff access only. Contact your administrator for credentials.
        </p>
      </div>
    </div>
  );
}
