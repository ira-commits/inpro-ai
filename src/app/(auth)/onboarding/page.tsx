import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import Image from "next/image";
import Link from "next/link";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Pull LinkedIn data from Supabase user metadata
  const meta = user.user_metadata ?? {};
  const fullName: string | null = meta.full_name ?? meta.name ?? null;
  const avatarUrl: string | null = meta.avatar_url ?? meta.picture ?? null;

  // Suggest a slug from their LinkedIn name
  const suggestedSlug = fullName
    ? fullName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .slice(0, 40)
    : "";

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      {/* Top bar */}
      <div className="border-b border-gray-200 bg-white px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/icon.png" alt="InPro.ai" width={26} height={30} />
          <span className="text-base font-bold text-[#1a2744] tracking-tight">
            InPro<span className="text-[#204ecf]">.ai</span>
          </span>
        </Link>
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          3-step setup
        </span>
      </div>

      <div className="flex items-start justify-center px-4 pt-10 pb-16">
        <div className="w-full max-w-[480px]">
          {/* Welcome header */}
          <div className="mb-8 text-center">
            {/* LinkedIn avatar */}
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={fullName ?? "Your photo"}
                width={64}
                height={64}
                className="mx-auto mb-4 h-16 w-16 rounded-full object-cover ring-4 ring-white shadow-md"
              />
            ) : (
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#204ecf] text-2xl font-bold text-white shadow-md">
                {fullName?.charAt(0).toUpperCase() ?? "?"}
              </div>
            )}

            {fullName && (
              <p className="text-sm font-semibold text-[#1a2744] mb-1">
                Hey, {fullName.split(" ")[0]}!
              </p>
            )}

            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#204ecf] mb-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#204ecf]" />
              Welcome — let&apos;s get you set up
            </div>
            <h1 className="text-[22px] font-bold text-[#1a2744] tracking-tight leading-tight">
              Your AI is 3 steps away
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              Takes under 3 minutes. We&apos;ve already pulled your info from LinkedIn.
            </p>
          </div>

          <OnboardingShell
            suggestedSlug={suggestedSlug}
            avatarUrl={avatarUrl}
            fullName={fullName}
          />
        </div>
      </div>
    </div>
  );
}
