"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import type { Consultant, Service } from "@/server/db/schema";
import { formatCents, formatDuration } from "@/lib/utils";

const TIMEZONES = [
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "America/Phoenix", "Europe/London", "Europe/Paris", "Europe/Berlin",
  "Asia/Tokyo", "Asia/Singapore", "Australia/Sydney",
];

export function ProfileSettingsForm({
  consultant,
  userEmail,
}: {
  consultant: Consultant & { services: Service[] };
  userEmail: string;
}) {
  const [slug, setSlug] = useState(consultant.slug);
  const [headline, setHeadline] = useState(consultant.headline ?? "");
  const [bio, setBio] = useState(consultant.bio ?? "");
  const [timezone, setTimezone] = useState(consultant.timezone ?? "America/New_York");
  const [saved, setSaved] = useState(false);

  const upsert = trpc.consultants.upsertProfile.useMutation({
    onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 2000); },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    upsert.mutate({ slug, headline, bio, timezone });
  }

  return (
    <div className="space-y-6">
      {/* Account */}
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Account</h2>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
          <p className="text-sm text-foreground">{userEmail}</p>
        </div>
      </section>

      {/* Profile */}
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Public profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">URL handle</label>
            <div className="flex items-center rounded-md border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring">
              <span className="px-3 py-2 text-sm text-muted-foreground bg-muted border-r border-input">inpro.ai/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Bio</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz.replace(/_/g, " ")}</option>)}
            </select>
          </div>
          <button
            type="submit"
            disabled={upsert.isPending}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saved ? "Saved!" : upsert.isPending ? "Saving..." : "Save profile"}
          </button>
        </form>
      </section>

      {/* Services */}
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Services</h2>
        {consultant.services.length === 0 ? (
          <p className="text-sm text-muted-foreground">No services yet.</p>
        ) : (
          <div className="space-y-2">
            {consultant.services.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-md bg-muted px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{formatDuration(s.durationMinutes)} · {s.priceCents === 0 ? "Free" : formatCents(s.priceCents)}</p>
                </div>
                <span className={`text-xs font-medium ${s.isActive ? "text-green-600" : "text-muted-foreground"}`}>
                  {s.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
