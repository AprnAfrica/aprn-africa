"use client";

import { useState, useEffect } from "react";

export default function EnrollButton({ programSlug }: { programSlug: string }) {
  const [state, setState] = useState<"idle" | "loading" | "enrolled">("idle");

  useEffect(() => {
    fetch("/api/dashboard/enroll")
      .then((r) => r.json())
      .then((data) => {
        if (data.enrollments?.some((e: { program_slug: string; status: string }) =>
          e.program_slug === programSlug && e.status === "enrolled"
        )) {
          setState("enrolled");
        }
      })
      .catch(() => {});
  }, [programSlug]);

  async function handleEnroll() {
    setState("loading");
    const res = await fetch("/api/dashboard/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programSlug }),
    });
    if (res.ok) {
      setState("enrolled");
    } else {
      setState("idle");
    }
  }

  if (state === "enrolled") {
    return (
      <div className="w-full py-3 text-center text-xs font-bold tracking-widest uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
        <i className="fa-solid fa-check mr-2" />
        Enrolled
      </div>
    );
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={state === "loading"}
      className="w-full py-3 text-center text-xs font-bold tracking-widest uppercase text-navy-900 bg-gold-500 hover:bg-gold-400 transition-colors disabled:opacity-50"
    >
      {state === "loading" ? "Enrolling..." : "Enrol Now"}
    </button>
  );
}
