import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { consultants, services } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { ProfileSettingsForm } from "@/components/consultant/profile-settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const consultant = await db.query.consultants.findFirst({
    where: eq(consultants.userId, user.id),
    with: { services: true },
  });
  if (!consultant) redirect("/onboarding");

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your profile, services, and account.</p>
      </div>
      <ProfileSettingsForm consultant={consultant} userEmail={user.email ?? ""} />
    </div>
  );
}
