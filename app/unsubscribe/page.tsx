"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";

function UnsubscribeForm() {
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const token = params.get("token") ?? "";

  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleUnsubscribe() {
    setState("loading");
    const res = await fetch("/api/newsletter/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token }),
    });
    if (res.ok) {
      setState("done");
    } else {
      setState("error");
    }
  }

  if (!email || !token) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <i className="fa-solid fa-link-slash text-red-400 text-3xl" />
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Invalid Link
        </h1>
        <p className="text-sm text-slate-400 max-w-sm">
          This unsubscribe link is missing required parameters. If you need help,
          contact <a href="mailto:info@aprn-africa.org" className="text-gold-500 hover:text-gold-400 transition-colors">info@aprn-africa.org</a>.
        </p>
      </div>
    );
  }

  if (state === "done") {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <i className="fa-solid fa-circle-check text-emerald-400 text-3xl" />
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Unsubscribed
        </h1>
        <p className="text-sm text-slate-400 max-w-sm">
          <span className="text-white font-medium">{email}</span> has been removed from the APRN Intelligence Briefing mailing list.
        </p>
        <Link
          href="/"
          className="mt-4 px-6 py-2.5 bg-gold-500 text-navy-900 text-xs font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors"
        >
          Back to APRN Africa
        </Link>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <i className="fa-solid fa-triangle-exclamation text-red-400 text-3xl" />
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Something Went Wrong
        </h1>
        <p className="text-sm text-slate-400 max-w-sm">
          We couldn&apos;t process your unsubscribe request. The link may be invalid or expired.
          Contact <a href="mailto:info@aprn-africa.org" className="text-gold-500 hover:text-gold-400 transition-colors">info@aprn-africa.org</a> for help.
        </p>
        <button
          onClick={() => setState("idle")}
          className="mt-4 px-6 py-2.5 border border-gold-500/30 text-gold-500 text-xs font-bold tracking-widest uppercase hover:bg-gold-500/10 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <i className="fa-solid fa-envelope-open text-gold-500 text-3xl" />
      <h1
        className="text-2xl font-bold text-white"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        Unsubscribe
      </h1>
      <p className="text-sm text-slate-400 max-w-sm">
        Remove <span className="text-white font-medium">{email}</span> from
        the APRN Intelligence Briefing mailing list?
      </p>
      <button
        onClick={handleUnsubscribe}
        disabled={state === "loading"}
        className="mt-4 px-8 py-3 bg-gold-500 text-navy-900 text-xs font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors disabled:opacity-50"
      >
        {state === "loading" ? "Processing..." : "Confirm Unsubscribe"}
      </button>
      <p className="text-xs text-slate-500 mt-2">
        Changed your mind? Just close this page — nothing happens until you click confirm.
      </p>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <main className="min-h-screen bg-navy-900 flex items-center justify-center px-6 py-20">
      <div className="bg-navy-800 border border-white/5 p-10 sm:p-14 max-w-110 w-full">
        <Suspense
          fallback={
            <div className="flex justify-center py-8">
              <i className="fa-solid fa-spinner fa-spin text-gold-500 text-2xl" />
            </div>
          }
        >
          <UnsubscribeForm />
        </Suspense>
      </div>
    </main>
  );
}
