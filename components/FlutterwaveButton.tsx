"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    FlutterwaveCheckout: (config: {
      public_key: string;
      tx_ref: string;
      amount: number;
      currency: string;
      payment_options: string;
      customer: { email: string; name?: string };
      customizations: { title: string; description: string; logo?: string };
      callback: (response: { transaction_id: number; tx_ref: string; status: string }) => void;
      onclose: () => void;
    }) => void;
  }
}

interface Props {
  planKey: string;
  planName: string;
  amount: number;
  currency: string;
  email: string;
  featured?: boolean;
}

type Status = "idle" | "loading-script" | "ready" | "paying" | "verifying" | "success" | "error";

export default function FlutterwaveButton({ planKey, planName, amount, currency, email, featured }: Props) {
  const [status, setStatus] = useState<Status>(() =>
    typeof window !== "undefined" && window.FlutterwaveCheckout ? "ready" : "loading-script"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (window.FlutterwaveCheckout) return;
    const script = document.createElement("script");
    script.src = "https://checkout.flutterwave.com/v3.js";
    script.async = true;
    script.onload = () => setStatus("ready");
    script.onerror = () => setStatus("error");
    document.body.appendChild(script);
  }, []);

  const handlePay = useCallback(() => {
    if (!window.FlutterwaveCheckout) return;
    const ref = `aprn-${planKey}-${Date.now()}`;
    setStatus("paying");
    setErrorMsg("");

    window.FlutterwaveCheckout({
      public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
      tx_ref: ref,
      amount,
      currency,
      payment_options: "card,banktransfer,ussd,mobilemoney",
      customer: { email },
      customizations: {
        title: "APRN Africa",
        description: `${planName} Membership`,
        logo: "https://aprn-africa.org/logo-aprn.png",
      },

      callback: async (response) => {
        setStatus("verifying");
        try {
          const res = await fetch("/api/flutterwave/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transaction_id: response.transaction_id, tier: planKey }),
          });

          if (!res.ok) {
            const { error } = await res.json();
            throw new Error(error ?? "Verification failed");
          }

          setStatus("success");
          setTimeout(() => router.push("/dashboard/membership?upgraded=true"), 1200);
        } catch (err) {
          setStatus("error");
          setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
        }
      },

      onclose: () => {
        if (status === "paying") setStatus("ready");
      },
    });
  }, [planKey, planName, amount, currency, email, router, status]);

  const base = featured
    ? "bg-gold-500 text-navy-900 hover:bg-gold-400"
    : "border border-gold-500/30 text-gold-500 hover:bg-gold-500/10";

  if (status === "success") {
    return (
      <div className="w-full py-2.5 flex items-center justify-center gap-2 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-[10px] font-bold tracking-widest uppercase">
        <i className="fa-solid fa-check" />
        Payment confirmed
      </div>
    );
  }

  if (status === "error" && errorMsg) {
    return (
      <div className="flex flex-col gap-2">
        <div className="w-full py-2 flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] tracking-wide">
          <i className="fa-solid fa-triangle-exclamation text-[8px]" />
          {errorMsg}
        </div>
        <button
          onClick={() => { setStatus("ready"); setErrorMsg(""); }}
          className={`w-full py-2.5 text-[10px] font-bold tracking-widest uppercase transition-colors ${base}`}
        >
          Try Again
        </button>
      </div>
    );
  }

  const isLoading = status === "loading-script" || status === "paying" || status === "verifying";
  const labelMap: Record<string, string> = {
    "loading-script": "Loading...",
    paying: "Opening checkout...",
    verifying: "Confirming payment...",
  };

  return (
    <button
      onClick={handlePay}
      disabled={isLoading}
      className={`w-full py-2.5 text-[10px] font-bold tracking-widest uppercase transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${base}`}
    >
      {isLoading ? (
        <>
          <i className="fa-solid fa-spinner fa-spin text-[9px]" />
          {labelMap[status] ?? "Processing..."}
        </>
      ) : (
        <>
          <i className="fa-solid fa-lock-open text-[9px]" />
          Join — Pay Now
        </>
      )}
    </button>
  );
}
