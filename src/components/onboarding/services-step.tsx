"use client";

import { useState } from "react";
import { useOnboardingStore, type ServiceDraft } from "@/store/onboarding";
import { trpc } from "@/lib/trpc/client";
import { cn, formatCents, formatDuration } from "@/lib/utils";

const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];

function ServiceForm({
  onAdd,
}: {
  onAdd: (s: ServiceDraft) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(60);
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    if (!name.trim()) { setError("Service name is required"); return; }
    const priceCents = Math.round(parseFloat(price || "0") * 100);
    if (isNaN(priceCents) || priceCents < 0) { setError("Enter a valid price"); return; }
    setError("");
    onAdd({
      id: crypto.randomUUID(),
      name: name.trim(),
      description,
      durationMinutes: duration,
      priceCents,
    });
    setName(""); setDescription(""); setDuration(60); setPrice("");
  }

  return (
    <div className="rounded-lg border border-dashed border-border p-4 space-y-3">
      <p className="text-sm font-medium text-foreground">Add a service</p>

      <input
        type="text"
        placeholder="e.g. Strategy Session"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <textarea
        rows={2}
        placeholder="Optional description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
      />

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs text-muted-foreground mb-1">Duration</label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {DURATION_OPTIONS.map((d) => (
              <option key={d} value={d}>{formatDuration(d)}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs text-muted-foreground mb-1">Price (USD)</label>
          <div className="flex items-center rounded-md border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring">
            <span className="px-2.5 text-sm text-muted-foreground">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="150.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="flex-1 py-2 pr-3 text-sm bg-transparent focus:outline-none"
            />
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <button
        type="button"
        onClick={handleAdd}
        className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
      >
        + Add service
      </button>
    </div>
  );
}

export function ServicesStep() {
  const { services, addService, removeService, setStep } = useOnboardingStore();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const createService = trpc.services.create.useMutation();

  async function handleContinue() {
    if (services.length === 0) {
      setError("Add at least one service to continue.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      for (const s of services) {
        await createService.mutateAsync({
          name: s.name,
          description: s.description || undefined,
          durationMinutes: s.durationMinutes,
          priceCents: s.priceCents,
        });
      }
      setStep("agent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      {services.length > 0 && (
        <ul className="space-y-2">
          {services.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDuration(s.durationMinutes)} ·{" "}
                  {s.priceCents === 0 ? "Free" : formatCents(s.priceCents)}
                </p>
              </div>
              <button
                onClick={() => removeService(s.id)}
                className="text-muted-foreground hover:text-destructive transition-colors ml-4"
                aria-label="Remove"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      <ServiceForm onAdd={addService} />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setStep("profile")}
          className="flex-1 rounded-md border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={saving}
          className="flex-1 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
