"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";

type AutomationType = "auto_confirm_booking" | "post_session_followup" | "proposal_generator" | "no_show_rebooking";

interface AutomationDef {
  type: AutomationType;
  title: string;
  description: string;
  pillar: string;
  id: string | null;
  isEnabled: boolean;
}

const PILLAR_STYLES: Record<string, string> = {
  "Back-Office": "bg-purple-50 text-purple-700 border-purple-200",
  "Live Session Intel": "bg-blue-50 text-blue-700 border-blue-200",
};

export function AutomationToggles({
  consultantId,
  automations,
}: {
  consultantId: string;
  automations: AutomationDef[];
}) {
  const [states, setStates] = useState<Record<AutomationType, boolean>>(
    Object.fromEntries(automations.map((a) => [a.type, a.isEnabled])) as Record<AutomationType, boolean>
  );
  const [loading, setLoading] = useState<AutomationType | null>(null);

  const toggle = trpc.automations.toggle.useMutation({
    onSuccess: (data, vars) => {
      setStates((s) => ({ ...s, [vars.type]: vars.isEnabled }));
      setLoading(null);
    },
    onError: () => setLoading(null),
  });

  function handleToggle(type: AutomationType, currentValue: boolean) {
    setLoading(type);
    toggle.mutate({ type, isEnabled: !currentValue, consultantId });
  }

  return (
    <div className="space-y-3">
      {automations.map((automation) => {
        const enabled = states[automation.type];
        const isLoading = loading === automation.type;

        return (
          <div
            key={automation.type}
            className={cn(
              "flex items-start justify-between rounded-lg border p-5 transition-colors",
              enabled ? "border-border bg-card" : "border-border bg-card opacity-80"
            )}
          >
            <div className="flex-1 pr-6">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-foreground">{automation.title}</p>
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${PILLAR_STYLES[automation.pillar]}`}>
                  {automation.pillar}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{automation.description}</p>
            </div>

            {/* Toggle switch */}
            <button
              role="switch"
              aria-checked={enabled}
              disabled={isLoading}
              onClick={() => handleToggle(automation.type, enabled)}
              className={cn(
                "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50",
                enabled ? "bg-primary" : "bg-muted"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200",
                  enabled ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}
