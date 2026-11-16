
"use client";

import { useState } from "react";

export default function QuickNewsletterSignup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName: "",
          org: "",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Subscription failed.");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-xl">
      {success ? (
        <p className="text-sm text-gold-500 font-semibold">
          <i className="fa-solid fa-check mr-2" />
          You're subscribed to APRN Intelligence Briefing.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 min-w-0 bg-navy-800 border border-navy-700 focus:border-gold-500 text-white text-sm px-4 py-3 outline-none rounded-sm"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-sm disabled:opacity-60 whitespace-nowrap"
          >
            {loading ? "Joining..." : "Subscribe"}
          </button>
        </form>
      )}

      {error && (
        <p className="text-xs text-red-400 mt-2">{error}</p>
      )}

      <p className="text-[11px] text-slate-500 mt-3">
        Free weekly intelligence briefing. Unsubscribe anytime.
      </p>
    </div>
  );
}
