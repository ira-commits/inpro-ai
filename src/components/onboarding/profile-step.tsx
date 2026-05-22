"use client";

import { useState } from "react";
import { useOnboardingStore } from "@/store/onboarding";
import { trpc } from "@/lib/trpc/client";

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
];

export function ProfileStep() {
  const { profile, setProfile, setStep } = useOnboardingStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const upsert = trpc.consultants.upsertProfile.useMutation({
    onSuccess: () => setStep("services"),
    onError: (err) => setErrors({ form: err.message }),
  });

  function validate() {
    const e: Record<string, string> = {};
    if (!profile.slug) e.slug = "URL handle is required";
    else if (!/^[a-z0-9-]+$/.test(profile.slug))
      e.slug = "Only lowercase letters, numbers, and hyphens";
    else if (profile.slug.length < 3) e.slug = "At least 3 characters";
    if (!profile.headline) e.headline = "Headline is required";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    upsert.mutate(profile);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Your public URL handle <span className="text-destructive">*</span>
        </label>
        <div className="flex items-center rounded-md border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring">
          <span className="px-3 py-2.5 text-sm text-muted-foreground bg-muted border-r border-input">
            inpro.ai/
          </span>
          <input
            type="text"
            placeholder="jane-doe"
            value={profile.slug}
            onChange={(e) =>
              setProfile({ slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })
            }
            className="flex-1 px-3 py-2.5 text-sm bg-transparent focus:outline-none"
          />
        </div>
        {errors.slug && (
          <p className="mt-1 text-xs text-destructive">{errors.slug}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Headline <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          placeholder="Executive Coach & Leadership Consultant"
          value={profile.headline}
          onChange={(e) => setProfile({ headline: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {errors.headline && (
          <p className="mt-1 text-xs text-destructive">{errors.headline}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Bio
        </label>
        <textarea
          rows={4}
          placeholder="Tell clients about your background, expertise, and how you help them..."
          value={profile.bio}
          onChange={(e) => setProfile({ bio: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Timezone
        </label>
        <select
          value={profile.timezone}
          onChange={(e) => setProfile({ timezone: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {errors.form && (
        <p className="text-sm text-destructive">{errors.form}</p>
      )}

      <button
        type="submit"
        disabled={upsert.isPending}
        className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {upsert.isPending ? "Saving..." : "Continue"}
      </button>
    </form>
  );
}
