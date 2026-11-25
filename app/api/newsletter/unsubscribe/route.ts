import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { groq } from "next-sanity";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe";

function getSanityWriteClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token     = process.env.SANITY_WRITE_TOKEN;
  if (!projectId || !token) return null;
  return createClient({ projectId, dataset, apiVersion: "2025-05-01", useCdn: false, token });
}

export async function POST(req: NextRequest) {
  const { email, token } = await req.json();

  if (!email || !token) {
    return NextResponse.json({ error: "Missing email or token." }, { status: 400 });
  }

  if (!verifyUnsubscribeToken(email, token)) {
    return NextResponse.json({ error: "Invalid unsubscribe link." }, { status: 403 });
  }

  const sanity = getSanityWriteClient();
  if (!sanity) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  }

  const subscriber = await sanity.fetch<{ _id: string; active: boolean } | null>(
    groq`*[_type == "subscriber" && email == $email][0]{ _id, active }`,
    { email: email.toLowerCase().trim() },
  );

  if (!subscriber) {
    return NextResponse.json({ ok: true, already: true });
  }

  if (!subscriber.active) {
    return NextResponse.json({ ok: true, already: true });
  }

  await sanity.patch(subscriber._id).set({ active: false }).commit();

  return NextResponse.json({ ok: true });
}
