import { create } from "zustand";

export type OnboardingStep = "profile" | "services" | "agent" | "done";

export interface ServiceDraft {
  id: string; // local draft id
  name: string;
  description: string;
  durationMinutes: number;
  priceCents: number;
}

interface OnboardingState {
  step: OnboardingStep;
  profile: {
    slug: string;
    headline: string;
    bio: string;
    timezone: string;
  };
  services: ServiceDraft[];
  agent: {
    name: string;
    persona: string;
    greeting: string;
  };
  setStep: (step: OnboardingStep) => void;
  setProfile: (profile: Partial<OnboardingState["profile"]>) => void;
  addService: (service: ServiceDraft) => void;
  removeService: (id: string) => void;
  setAgent: (agent: Partial<OnboardingState["agent"]>) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: "profile",
  profile: { slug: "", headline: "", bio: "", timezone: "America/New_York" },
  services: [],
  agent: { name: "", persona: "", greeting: "" },

  setStep: (step) => set({ step }),
  setProfile: (profile) =>
    set((s) => ({ profile: { ...s.profile, ...profile } })),
  addService: (service) =>
    set((s) => ({ services: [...s.services, service] })),
  removeService: (id) =>
    set((s) => ({ services: s.services.filter((sv) => sv.id !== id) })),
  setAgent: (agent) =>
    set((s) => ({ agent: { ...s.agent, ...agent } })),
}));
