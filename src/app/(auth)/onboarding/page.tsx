import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import Link from "next/link";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      {/* Top bar */}
      <div className="border-b border-gray-200 bg-white px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-[#1a2744] tracking-tight">
          InPro.ai
        </Link>
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Member setup
        </span>
      </div>

      <div className="flex items-start justify-center px-4 pt-12 pb-16">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#204ecf] mb-4">
              Welcome to InPro.ai
            </div>
            <h1 className="text-2xl font-bold text-[#1a2744] tracking-tight">
              Set up your consultant profile
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Takes 3 minutes. Everything can be edited later.
            </p>
          </div>
          <OnboardingShell />
        </div>
      </div>
    </div>
  );
}
