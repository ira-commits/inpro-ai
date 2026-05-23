"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";

interface ResumeData {
  currentTitle: string;
  currentCompany: string;
  yearsExperience: string;
  previousRoles: { title: string; company: string; years: string }[];
  skills: string;
  industries: string[];
  education: string;
  certifications: string;
  summary: string;
  idealClient: string;
  approach: string;
  services: string;
}

const INDUSTRY_OPTIONS = [
  "Technology", "Finance & Banking", "Healthcare", "Consulting", "Marketing",
  "Sales", "Operations", "HR & Talent", "Legal", "Real Estate",
  "Education", "Non-profit", "Government", "Retail & E-commerce", "Media",
];

const EMPTY_ROLE = { title: "", company: "", years: "" };

export function ResumeTrainingForm({ consultantId }: { consultantId: string }) {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<ResumeData>({
    currentTitle: "",
    currentCompany: "",
    yearsExperience: "",
    previousRoles: [{ ...EMPTY_ROLE }],
    skills: "",
    industries: [],
    education: "",
    certifications: "",
    summary: "",
    idealClient: "",
    approach: "",
    services: "",
  });

  const add = trpc.knowledge.add.useMutation();

  function set<K extends keyof ResumeData>(key: K, value: ResumeData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleIndustry(industry: string) {
    set(
      "industries",
      form.industries.includes(industry)
        ? form.industries.filter((i) => i !== industry)
        : [...form.industries, industry]
    );
  }

  function updateRole(index: number, field: keyof typeof EMPTY_ROLE, value: string) {
    const updated = form.previousRoles.map((r, i) =>
      i === index ? { ...r, [field]: value } : r
    );
    set("previousRoles", updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const chunks: string[] = [];

    // Work history
    const workLines: string[] = [];
    if (form.currentTitle || form.currentCompany) {
      workLines.push(
        `Current role: ${form.currentTitle}${form.currentCompany ? ` at ${form.currentCompany}` : ""}`
      );
    }
    if (form.yearsExperience) {
      workLines.push(`Total experience: ${form.yearsExperience} years in the industry`);
    }
    const validPrev = form.previousRoles.filter((r) => r.title || r.company);
    if (validPrev.length > 0) {
      workLines.push(
        "Previous experience: " +
          validPrev
            .map((r) => `${r.title}${r.company ? ` at ${r.company}` : ""}${r.years ? ` (${r.years} years)` : ""}`)
            .join(", ")
      );
    }
    if (workLines.length > 0) chunks.push(workLines.join("\n"));

    // Skills
    if (form.skills.trim()) {
      chunks.push(`Skills and expertise: ${form.skills.trim()}`);
    }

    // Industries
    if (form.industries.length > 0) {
      chunks.push(`Industries I work in: ${form.industries.join(", ")}`);
    }

    // Education & certs
    const eduLines: string[] = [];
    if (form.education.trim()) eduLines.push(`Education: ${form.education.trim()}`);
    if (form.certifications.trim()) eduLines.push(`Certifications: ${form.certifications.trim()}`);
    if (eduLines.length > 0) chunks.push(eduLines.join("\n"));

    // Summary / about
    if (form.summary.trim()) {
      chunks.push(`About me: ${form.summary.trim()}`);
    }

    // Ideal client
    if (form.idealClient.trim()) {
      chunks.push(`Who I work with: ${form.idealClient.trim()}`);
    }

    // Approach
    if (form.approach.trim()) {
      chunks.push(`My approach and methodology: ${form.approach.trim()}`);
    }

    // Services
    if (form.services.trim()) {
      chunks.push(`Services I offer: ${form.services.trim()}`);
    }

    // Submit all chunks in sequence
    for (const content of chunks) {
      await add.mutateAsync({ consultantId, content });
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const isPending = add.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Work Experience */}
      <section className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="bg-[#F3F2EF] border-b border-gray-200 px-6 py-4">
          <h2 className="font-bold text-[#191919]">Work Experience</h2>
          <p className="text-xs text-[#666666] mt-0.5">Your background trains your AI to speak with authority.</p>
        </div>
        <div className="px-6 py-6 space-y-5">
          {/* Current role */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-[#191919] mb-1.5">Current Title *</label>
              <input
                type="text"
                placeholder="e.g. Product Strategy Consultant"
                value={form.currentTitle}
                onChange={(e) => set("currentTitle", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-[#191919] mb-1.5">Current Company</label>
              <input
                type="text"
                placeholder="e.g. Self-employed / Acme Corp"
                value={form.currentCompany}
                onChange={(e) => set("currentCompany", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-[#191919] mb-1.5">Years of Experience</label>
              <select
                value={form.yearsExperience}
                onChange={(e) => set("yearsExperience", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] bg-white"
              >
                <option value="">Select...</option>
                {["1-2", "3-5", "6-10", "11-15", "16-20", "20+"].map((y) => (
                  <option key={y} value={y}>{y} years</option>
                ))}
              </select>
            </div>
          </div>

          {/* Previous roles */}
          <div>
            <label className="block text-xs font-semibold text-[#191919] mb-2">Previous Roles</label>
            <div className="space-y-3">
              {form.previousRoles.map((role, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
                  <input
                    type="text"
                    placeholder="Job title"
                    value={role.title}
                    onChange={(e) => updateRole(i, "title", e.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Company name"
                    value={role.company}
                    onChange={(e) => updateRole(i, "company", e.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Years"
                      value={role.years}
                      onChange={(e) => updateRole(i, "years", e.target.value)}
                      className="w-24 rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
                    />
                    {form.previousRoles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => set("previousRoles", form.previousRoles.filter((_, idx) => idx !== i))}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {form.previousRoles.length < 5 && (
              <button
                type="button"
                onClick={() => set("previousRoles", [...form.previousRoles, { ...EMPTY_ROLE }])}
                className="mt-3 text-xs font-semibold text-[#0A66C2] hover:underline"
              >
                + Add another role
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="bg-[#F3F2EF] border-b border-gray-200 px-6 py-4">
          <h2 className="font-bold text-[#191919]">Skills & Expertise</h2>
          <p className="text-xs text-[#666666] mt-0.5">Your AI uses these to qualify clients and answer domain questions.</p>
        </div>
        <div className="px-6 py-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#191919] mb-1.5">
              Top Skills <span className="font-normal text-[#666666]">(separate with commas)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Product Strategy, Go-to-Market, Team Leadership, SaaS, Fundraising"
              value={form.skills}
              onChange={(e) => set("skills", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191919] mb-2">Industries</label>
            <div className="flex flex-wrap gap-2">
              {INDUSTRY_OPTIONS.map((industry) => (
                <button
                  key={industry}
                  type="button"
                  onClick={() => toggleIndustry(industry)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    form.industries.includes(industry)
                      ? "border-[#0A66C2] bg-[#EEF3FB] text-[#0A66C2]"
                      : "border-gray-300 bg-white text-[#666666] hover:border-[#0A66C2] hover:text-[#0A66C2]"
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="bg-[#F3F2EF] border-b border-gray-200 px-6 py-4">
          <h2 className="font-bold text-[#191919]">Education & Credentials</h2>
        </div>
        <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#191919] mb-1.5">Education</label>
            <input
              type="text"
              placeholder="e.g. MBA, Harvard Business School"
              value={form.education}
              onChange={(e) => set("education", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#191919] mb-1.5">Certifications & Awards</label>
            <input
              type="text"
              placeholder="e.g. PMP, CFA, Forbes 30 Under 30"
              value={form.certifications}
              onChange={(e) => set("certifications", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* About */}
      <section className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="bg-[#F3F2EF] border-b border-gray-200 px-6 py-4">
          <h2 className="font-bold text-[#191919]">About You</h2>
          <p className="text-xs text-[#666666] mt-0.5">This is the voice your AI will use when talking to clients.</p>
        </div>
        <div className="px-6 py-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#191919] mb-1.5">
              Professional Summary *
            </label>
            <textarea
              rows={4}
              placeholder="Write in first person. e.g. I help early-stage SaaS founders build repeatable revenue. After 12 years at Google and two successful exits, I bring operator-level insight that most advisors can't match..."
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191919] mb-1.5">Who I Work With</label>
            <textarea
              rows={3}
              placeholder="e.g. I work best with Series A-B SaaS founders who have product-market fit but are struggling with go-to-market. My clients typically have 5-50 employees and $500K-$5M ARR..."
              value={form.idealClient}
              onChange={(e) => set("idealClient", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191919] mb-1.5">My Approach & Methodology</label>
            <textarea
              rows={3}
              placeholder="e.g. Every engagement starts with a 30-minute discovery call. I use a 3-step framework: diagnose, design, deploy. I don't do long retainers — I focus on 90-day sprints with clear outcomes..."
              value={form.approach}
              onChange={(e) => set("approach", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191919] mb-1.5">Services I Offer</label>
            <textarea
              rows={3}
              placeholder="e.g. 1:1 Strategy Sessions ($350/hr), GTM Audit ($2,500 flat), 90-Day Growth Sprint ($8,000)..."
              value={form.services}
              onChange={(e) => set("services", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center justify-between rounded-xl border border-[#0A66C2]/20 bg-[#EEF3FB] px-6 py-5">
        <div>
          <p className="text-sm font-bold text-[#191919]">Train your AI agent</p>
          <p className="text-xs text-[#666666] mt-0.5">
            Your answers become knowledge chunks your AI uses in every conversation.
          </p>
        </div>
        <button
          type="submit"
          disabled={isPending || (!form.currentTitle && !form.summary)}
          className="rounded-full bg-[#0A66C2] px-8 py-3 text-sm font-bold text-white hover:bg-[#004182] transition-colors disabled:opacity-50 shrink-0"
        >
          {saved ? "Saved to AI!" : isPending ? "Training..." : "Save & Train AI"}
        </button>
      </div>

    </form>
  );
}
