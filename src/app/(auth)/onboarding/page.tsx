import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen items-start justify-center bg-background px-4 pt-16 pb-8">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Set up your InPro.ai profile
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Takes about 3 minutes. You can edit everything later.
          </p>
        </div>
        <OnboardingShell />
      </div>
    </div>
  );
}
