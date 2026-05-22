"use client";

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

export function OnboardingShell() {
  const { step } = useOnboardingStore();

  if (step === "done") return null;

  const { title, subtitle } = STEP_TITLES[step];

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <StepIndicator current={step} />
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>

        {step === "profile" && <ProfileStep />}
        {step === "services" && <ServicesStep />}
        {step === "agent" && <AgentStep />}
      </div>
    </div>
  );
}
