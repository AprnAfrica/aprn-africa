import { createAdminClient } from "@/lib/supabase/admin";
import AdminTalentClient from "@/components/admin/AdminTalentClient";

export const metadata = { title: "Talent Applications | APRN Admin" };
export const dynamic = "force-dynamic";

export default async function AdminTalentPage() {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("talent_applications")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-400">Failed to load applications: {error.message}</p>
      </div>
    );
  }

  return <AdminTalentClient applications={data ?? []} />;
}
