"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import type { Agent } from "@/server/db/schema";
import { cn } from "@/lib/utils";

export function AgentConfigForm({ agent }: { agent: Agent | null | undefined }) {
  const [name, setName] = useState(agent?.name ?? "");
  const [persona, setPersona] = useState(agent?.persona ?? "");
  const [greeting, setGreeting] = useState(agent?.greeting ?? "");
  const [isActive, setIsActive] = useState(agent?.isActive ?? true);
  const [saved, setSaved] = useState(false);

  const upsert = trpc.agent.upsertConfig.useMutation({
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const toggleActive = trpc.agent.toggleActive.useMutation({
    onSuccess: (data) => setIsActive(data.isActive),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    upsert.mutate({ name, persona, greeting });
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
      {/* Active toggle */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <p className="text-sm font-medium text-foreground">Agent active</p>
          <p className="text-xs text-muted-foreground">Live on your public profile</p>
        </div>
        <button
          role="switch"
          aria-checked={isActive}
          onClick={() => agent && toggleActive.mutate({ isActive: !isActive })}
          disabled={!agent || toggleActive.isPending}
          className={cn(
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50",
            isActive ? "bg-primary" : "bg-muted"
          )}
        >
          <span className={cn("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200", isActive ? "translate-x-5" : "translate-x-0")} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Agent name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. SarahAI"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Persona</label>
          <textarea
            rows={4}
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            placeholder="Describe how your AI should communicate..."
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Opening greeting</label>
          <textarea
            rows={2}
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            placeholder="Hi! How can I help you today?"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <button
          type="submit"
          disabled={upsert.isPending}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saved ? "Saved!" : upsert.isPending ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
