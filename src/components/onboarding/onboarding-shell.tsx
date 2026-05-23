"use client";

import { useEffect } from "react";
import { useOnboardingStore } from "@/store/onboarding";
import { StepIndicator } from "./step-indicator";
import { ProfileStep } from "./profile-step";
import { ServicesStep } from "./services-step";
import { AgentStep } from "./agent-step";

const STEP_TITLES: Record<string, { title: string; subtitle: string }> = {
  profile: {
    title: "Your consultant profile",
    subtitle: "This is what clients see on your public page.",
  },
  services: {
    title: "What do you offer?",
    subtitle: "Add the services clients can book with you.",
  },
  agent: {
    title: "Configure your AI agent",
    subtitle: "Your AI will chat with clients and book sessions on your behalf.",
  },
};

interface OnboardingShellProps {
  suggestedSlug?: string;
  avatarUrl?: string | null;
  fullName?: string | null;
}

export function OnboardingShell({
  suggestedSlug = "",
  avatarUrl,
  fullName,
}: OnboardingShellProps) {
  const { step, setProfile } = useOnboardingStore();

  // Pre-fill slug from LinkedIn name on first mount
  useEffect(() => {
    if (suggestedSlug) {
      setProfile({ slug: suggestedSlug });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (step === "done") return null;

  const { title, subtitle } = STEP_TITLES[step];

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <StepIndicator current={step} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-base font-bold text-[#1a2744]">{title}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        </div>

        {step === "profile" && (
          <ProfileStep avatarUrl={avatarUrl} fullName={fullName} />
        )}
        {step === "services" && <ServicesStep />}
        {step === "agent" && <AgentStep />}
      </div>
    </div>
  );
}
