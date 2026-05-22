"use client";

import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/onboarding";
import { trpc } from "@/lib/trpc/client";
import { useState } from "react";

const PERSONA_PRESETS = [
  {
    label: "Professional & Direct",
    value:
      "Communicate in a clear, confident, and professional tone. Be direct and concise. Focus on outcomes and value.",
  },
  {
    label: "Warm & Empathetic",
    value:
      "Be warm, encouraging, and empathetic. Use a conversational tone. Show genuine interest in the client's challenges.",
  },
  {
    label: "Expert & Authoritative",
    value:
      "Lead with expertise and authority. Use industry terminology appropriately. Position as a trusted expert advisor.",
  },
];

export function AgentStep() {
  const router = useRouter();
  const { agent, setAgent, setStep } = useOnboardingStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const upsertAgent = trpc.agent.upsertConfig.useMutation({
    onSuccess: () => router.push("/dashboard"),
    onError: (err) => setErrors({ form: err.message }),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!agent.name.trim()) errs.name = "Agent name is required";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    upsertAgent.mutate({
      name: agent.name,
      persona: agent.persona || undefined,
      greeting: agent.greeting || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Agent name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. SarahAI, CoachBot, Alex"
          value={agent.name}
          onChange={(e) => setAgent({ name: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          This is what clients see when chatting with your AI.
        </p>
        {errors.name && (
          <p className="mt-1 text-xs text-destructive">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Personality preset
        </label>
        <div className="grid grid-cols-1 gap-2">
          {PERSONA_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setAgent({ persona: preset.value })}
              className={`text-left rounded-md border px-4 py-3 text-sm transition-colors ${
                agent.persona === preset.value
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-input bg-background hover:bg-accent text-foreground"
              }`}
            >
              <p className="font-medium">{preset.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {preset.value}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Custom persona <span className="text-muted-foreground">(optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="Describe how your AI should communicate with clients..."
          value={agent.persona}
          onChange={(e) => setAgent({ persona: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Opening greeting <span className="text-muted-foreground">(optional)</span>
        </label>
        <textarea
          rows={2}
          placeholder={`Hi! I'm ${agent.name || "your AI assistant"}. How can I help you today?`}
          value={agent.greeting}
          onChange={(e) => setAgent({ greeting: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      {errors.form && (
        <p className="text-sm text-destructive">{errors.form}</p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setStep("services")}
          className="flex-1 rounded-md border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={upsertAgent.isPending}
          className="flex-1 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {upsertAgent.isPending ? "Finishing..." : "Go to dashboard"}
        </button>
      </div>
    </form>
  );
}
