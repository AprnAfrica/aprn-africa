import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const TIER_AMOUNTS: Record<string, Record<string, number>> = {
  student:      { NGN: 10_000, USD: 6 },
  graduate:     { NGN: 25_000, USD: 15 },
  professional: { NGN: 50_000, USD: 30 },
  associate:    { NGN: 35_000, USD: 20 },
  corporate:    { NGN: 500_000, USD: 300 },
  international:{ USD: 100 },
};

export async function POST(req: NextRequest) {
  const { transaction_id, tier } = await req.json();

  if (!transaction_id || !tier) {
    return NextResponse.json({ error: "Missing transaction_id or tier" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transaction_id)}/verify`,
    { headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` } }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Flutterwave API error" }, { status: 502 });
  }

  const json = await res.json();

  if (json.status !== "success" || json.data?.status !== "successful") {
    return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
  }

  const txData = json.data;
  const currency = (txData.currency ?? "NGN").toUpperCase();
  const tierAmounts = TIER_AMOUNTS[tier];
  const expectedAmount = tierAmounts?.[currency];

  if (expectedAmount && txData.amount !== expectedAmount) {
    console.warn(`Amount mismatch — expected ${expectedAmount} ${currency}, got ${txData.amount}`);
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const admin = createAdminClient();
  const paymentRef = txData.tx_ref ?? String(transaction_id);

  const { data: existing } = await admin
    .from("payments")
    .select("id")
    .eq("payment_ref", paymentRef)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ success: true, tier });
  }

  const { error: paymentError } = await admin.from("payments").insert({
    user_id: user.id,
    payment_ref: paymentRef,
    provider_txn_id: String(txData.id ?? ""),
    provider: "flutterwave",
    amount: txData.amount,
    currency,
    status: "success",
    payment_type: "membership",
    related_id: tier,
    paid_at: txData.created_at ?? new Date().toISOString(),
    metadata: {
      email: txData.customer?.email ?? null,
      channel: txData.payment_type ?? null,
      flw_ref: txData.flw_ref ?? null,
    },
  });

  if (paymentError) {
    console.error("Payment insert error:", paymentError);
    return NextResponse.json({ error: "Failed to record payment" }, { status: 500 });
  }

  const upgradeTier = tier === "international" ? "professional" : tier;

  const { error: dbError } = await admin
    .from("profiles")
    .update({ membership_tier: upgradeTier, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (dbError) {
    console.error("Profile update error:", dbError);
    return NextResponse.json({ error: "Failed to update membership" }, { status: 500 });
  }

  return NextResponse.json({ success: true, tier: upgradeTier });
}
