import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { programSlug } = await req.json();
  if (!programSlug || typeof programSlug !== "string") {
    return NextResponse.json({ error: "programSlug is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("course_enrollments")
    .upsert(
      { user_id: user.id, program_slug: programSlug, status: "enrolled" },
      { onConflict: "user_id,program_slug" },
    )
    .select("id, enrolled_at")
    .single();

  if (error) {
    console.error("[enroll] Error:", error);
    return NextResponse.json({ error: "Failed to enroll" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, enrollmentId: data.id, enrolledAt: data.enrolled_at });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("course_enrollments")
    .select("id, program_slug, status, enrolled_at")
    .eq("user_id", user.id)
    .order("enrolled_at", { ascending: false });

  if (error) {
    console.error("[enroll] Error:", error);
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 });
  }

  return NextResponse.json({ enrollments: data ?? [] });
}
