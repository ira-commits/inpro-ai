"use client";

import { useState } from "react";
import Image from "next/image";
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

interface ProfileStepProps {
  avatarUrl?: string | null;
  fullName?: string | null;
}

export function ProfileStep({ avatarUrl, fullName }: ProfileStepProps) {
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
    if (!profile.headline) e.headline = "Required — tell clients what you do";
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
      {/* LinkedIn photo + name confirmation */}
      {(avatarUrl || fullName) && (
        <div className="flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={fullName ?? "Your photo"}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover shrink-0 ring-2 ring-white"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#204ecf] text-sm font-bold text-white">
              {fullName?.charAt(0).toUpperCase() ?? "?"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            {fullName && (
              <p className="text-sm font-semibold text-[#1a2744] truncate">{fullName}</p>
            )}
            <p className="text-xs text-[#0A66C2] flex items-center gap-1 mt-0.5">
              <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Photo &amp; name pulled from LinkedIn
            </p>
          </div>
        </div>
      )}

      {/* URL handle */}
      <div>
        <label className="block text-sm font-medium text-[#1a2744] mb-1.5">
          Your public URL <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center rounded-lg border border-gray-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#204ecf]">
          <span className="px-3 py-2.5 text-sm text-gray-400 bg-gray-50 border-r border-gray-200 shrink-0">
            inpro.ai/
          </span>
          <input
            type="text"
            placeholder="jane-doe"
            value={profile.slug}
            onChange={(e) =>
              setProfile({ slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })
            }
            className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
          />
        </div>
        {errors.slug ? (
          <p className="mt-1 text-xs text-red-500">{errors.slug}</p>
        ) : profile.slug ? (
          <p className="mt-1 text-xs text-gray-400">
            Your page: inpro.ai/<span className="font-medium text-[#204ecf]">{profile.slug}</span>
          </p>
        ) : null}
      </div>

      {/* Headline */}
      <div>
        <label className="block text-sm font-medium text-[#1a2744] mb-1.5">
          What do you do? <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Executive Coach & Leadership Consultant"
          value={profile.headline}
          onChange={(e) => setProfile({ headline: e.target.value })}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#204ecf]"
        />
        <p className="mt-1 text-xs text-gray-400">
          Clients see this on your profile — be specific
        </p>
        {errors.headline && (
          <p className="mt-1 text-xs text-red-500">{errors.headline}</p>
        )}
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-[#1a2744] mb-1.5">
          About you <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="Tell clients about your background and how you help them..."
          value={profile.bio}
          onChange={(e) => setProfile({ bio: e.target.value })}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#204ecf] resize-none"
        />
      </div>

      {/* Timezone */}
      <div>
        <label className="block text-sm font-medium text-[#1a2744] mb-1.5">
          Timezone
        </label>
        <select
          value={profile.timezone}
          onChange={(e) => setProfile({ timezone: e.target.value })}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#204ecf]"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {errors.form && (
        <p className="text-sm text-red-500">{errors.form}</p>
      )}

      <button
        type="submit"
        disabled={upsert.isPending}
        className="w-full rounded-lg bg-[#204ecf] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1a3fb5] transition-colors disabled:opacity-50"
      >
        {upsert.isPending ? "Saving..." : "Continue →"}
      </button>
    </form>
  );
}
