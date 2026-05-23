"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <Image src="/logo.png" alt="InPro.ai" width={110} height={50} priority />
        <div className="flex items-center gap-6">
          <Link href="/consultants" className="text-sm font-medium text-gray-600 hover:text-[#1a2744] transition-colors">
            Find experts
          </Link>
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-[#1a2744] transition-colors">
            Sign in
          </Link>
          <Link
            href="/login"
            className="rounded bg-[#204ecf] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1a3fa8] transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#1a2744] text-white">
        <div className="max-w-5xl mx-auto px-8 py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-red-300 mb-8">
            900,000+ tech workers laid off since 2023
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight mb-6">
            AI took the job.<br />
            <span className="text-[#4d8eff]">Use AI to replace the boss.</span>
          </h1>
          <p className="text-lg text-blue-100/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Turn years of expertise into a consulting practice in minutes. Your AI handles clients 24/7, books sessions, and runs the back-office — you just show up and deliver.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="rounded bg-[#204ecf] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[#1a3fa8] transition-colors"
            >
              Launch your practice free
            </Link>
            <Link
              href="/consultants"
              className="rounded border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Browse experts
            </Link>
          </div>
          <p className="mt-6 text-xs text-blue-200/50">
            Free to start. No resume required. Just your expertise.
          </p>
        </div>
      </section>

      {/* Social proof / urgency strip */}
      <section className="border-b border-gray-100 bg-[#f7f9fc]">
        <div className="max-w-3xl mx-auto px-8 py-10 text-center">
          <p className="text-base text-[#1a2744] font-semibold leading-relaxed">
            You spent years building expertise. A layoff notice doesn&apos;t erase that — it&apos;s your starting line.
          </p>
          <p className="mt-3 text-sm text-gray-500 max-w-xl mx-auto">
            Thousands of professionals are turning their industry knowledge into consulting income, often matching or exceeding their old salary — without the commute, the politics, or the PIP.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-8 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: "900K+", label: "Tech workers laid off since 2023" },
            { value: "3 min", label: "To launch your consulting page" },
            { value: "24/7", label: "Your AI works while you sleep" },
            { value: "$0", label: "To get started today" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-[#1a2744]">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Earnings calculator */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#204ecf] mb-3">Your potential</p>
            <h2 className="text-3xl font-bold text-[#1a2744]">What could you earn?</h2>
            <p className="mt-3 text-sm text-gray-500">Adjust the sliders to see your projected consulting income.</p>
          </div>
          <EarningsCalculator />
        </div>
      </section>

      {/* The Problem */}
      <section className="bg-[#f7f9fc] py-20">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#204ecf] mb-3">The old way vs. the new way</p>
            <h2 className="text-3xl font-bold text-[#1a2744]">Stop trading hours for dollars.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">The old way</p>
              <ul className="space-y-3 text-sm text-gray-600">
                {[
                  "Spend months networking to find clients",
                  "Play phone tag to schedule calls",
                  "Answer the same questions over and over",
                  "Miss leads while you sleep",
                  "Cap income at hours in a day",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 text-red-400">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border-2 border-[#204ecf]/30 bg-[#f0f4ff] p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#204ecf] mb-4">With InPro.ai</p>
              <ul className="space-y-3 text-sm text-gray-700">
                {[
                  "Live in 3 minutes, shared on LinkedIn instantly",
                  "AI books sessions while you're offline",
                  "AI answers questions from your knowledge base",
                  "Zero missed leads — your AI never sleeps",
                  "Income scales with AI, not your calendar",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 text-[#204ecf]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#204ecf] mb-3">How it works</p>
            <h2 className="text-3xl font-bold text-[#1a2744]">From laid off to live in 3 minutes.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect your LinkedIn",
                description: "Sign in with LinkedIn and your profile photo, name, and experience import automatically. No resume needed.",
              },
              {
                step: "02",
                title: "Train your AI in minutes",
                description: "Tell your AI your expertise, services, and pricing. It learns how you work and starts qualifying clients immediately.",
              },
              {
                step: "03",
                title: "Go live and get paid",
                description: "Hit publish, share your link on LinkedIn, and watch your AI book sessions and handle clients around the clock.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <p className="text-4xl font-bold text-gray-100 mb-4">{item.step}</p>
                <h3 className="text-base font-bold text-[#1a2744] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-[#f7f9fc] py-20">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#204ecf] mb-3">Platform</p>
            <h2 className="text-3xl font-bold text-[#1a2744]">Your AI runs the business.<br />You deliver the expertise.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: "🤖",
                title: "Your AI clone, 24/7",
                description: "Trained on your knowledge. Answers questions, qualifies leads, and books paid sessions — even at 2am when a potential client is researching.",
              },
              {
                icon: "🎙",
                title: "Session intel that compounds",
                description: "Every session is transcribed, summarised, and fed back into your AI. Your knowledge base gets richer every time you work — and so does your income.",
              },
              {
                icon: "⚡",
                title: "Back-office on autopilot",
                description: "Auto-confirm bookings, send follow-ups, generate proposals, re-book no-shows. All automatic. No VA needed.",
              },
            ].map((pillar) => (
              <div key={pillar.title} className="rounded-lg border border-gray-200 bg-white p-6">
                <span className="text-2xl mb-4 block">{pillar.icon}</span>
                <h3 className="font-bold text-[#1a2744] mb-2">{pillar.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sam Altman quote */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-3xl mx-auto px-8 py-12 text-center">
          <p className="text-lg text-[#1a2744] font-medium leading-relaxed">
            &ldquo;OpenAI CEO Sam Altman predicts the emergence of a &lsquo;one person, billion-dollar company&rsquo; in the near future due to advancements in AI.&rdquo;
          </p>
          <p className="mt-3 text-sm text-gray-400">Sam Altman, CEO of OpenAI</p>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-[#f7f9fc] py-20">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#204ecf] mb-3">Pricing</p>
            <h2 className="text-3xl font-bold text-[#1a2744]">Start free. Scale with AI.</h2>
            <p className="mt-3 text-sm text-gray-500">No monthly commitment while you&apos;re getting started.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Starter */}
            <div className="rounded-lg border border-gray-200 bg-white p-8">
              <h3 className="text-lg font-bold text-[#1a2744] mb-1">Starter</h3>
              <div className="text-3xl font-bold text-[#1a2744] mb-1">Free</div>
              <p className="text-sm text-gray-400 mb-6">+ 5% per transaction</p>
              <ul className="space-y-2 text-sm text-gray-600">
                {["Public profile", "Payments via Stripe", "Scheduling via Cal.com", "Invoicing"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-[#204ecf]">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="mt-8 block text-center rounded border border-[#204ecf] px-6 py-2.5 text-sm font-semibold text-[#204ecf] hover:bg-[#204ecf] hover:text-white transition-colors"
              >
                Get started free
              </Link>
            </div>
            {/* Pro */}
            <div className="rounded-lg border-2 border-[#204ecf] bg-white p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#204ecf] px-3 py-1 text-xs font-semibold text-white">
                Most popular
              </div>
              <h3 className="text-lg font-bold text-[#1a2744] mb-1">Pro</h3>
              <div className="text-3xl font-bold text-[#1a2744] mb-1">$19.95<span className="text-base font-normal text-gray-400">/mo</span></div>
              <p className="text-sm text-gray-400 mb-6">Unlock your AI agent</p>
              <ul className="space-y-2 text-sm text-gray-600">
                {["AI Agent (answers, qualifies, books)", "Profile, Payments, Scheduling", "Session transcription + AI summaries", "Automated follow-ups & proposals"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-[#204ecf]">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="mt-8 block text-center rounded bg-[#204ecf] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1a3fa8] transition-colors"
              >
                Launch your practice
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1a2744] text-white py-20">
        <div className="max-w-2xl mx-auto px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-300/70 mb-4">Don&apos;t wait for the next opportunity</p>
          <h2 className="text-3xl font-bold mb-4">Your expertise is the product.<br />Let AI do the selling.</h2>
          <p className="text-blue-100/70 mb-8">
            Launch your consulting practice today. Your AI goes live the moment you hit publish.
          </p>
          <Link
            href="/login"
            className="inline-block rounded bg-[#204ecf] px-10 py-4 text-sm font-semibold text-white hover:bg-[#1a3fa8] transition-colors"
          >
            Launch your practice — it&apos;s free
          </Link>
          <p className="mt-4 text-xs text-blue-200/40">Sign in with LinkedIn. Live in 3 minutes.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-8 flex items-center justify-between">
          <Image src="/logo.png" alt="InPro.ai" width={80} height={36} />
          <p className="text-xs text-gray-400">© 2026 InPro.ai. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

function EarningsCalculator() {
  const [sessions, setSessions] = useState(8);
  const [rate, setRate] = useState(200);

  const monthly = sessions * rate;
  const annual = monthly * 12;

  function fmt(n: number) {
    return n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n}`;
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
        {/* Sessions slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-[#1a2744]">Sessions per month</label>
            <span className="text-lg font-bold text-[#204ecf]">{sessions}</span>
          </div>
          <input
            type="range"
            min={1}
            max={40}
            value={sessions}
            onChange={(e) => setSessions(Number(e.target.value))}
            className="w-full accent-[#204ecf]"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1</span>
            <span>40</span>
          </div>
        </div>

        {/* Rate slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-[#1a2744]">Rate per session</label>
            <span className="text-lg font-bold text-[#204ecf]">${rate}</span>
          </div>
          <input
            type="range"
            min={50}
            max={1000}
            step={25}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-[#204ecf]"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>$50</span>
            <span>$1,000</span>
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="rounded-xl bg-[#f0f4ff] px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#204ecf] mb-1">Your projected income</p>
          <p className="text-4xl font-bold text-[#1a2744]">{fmt(monthly)}<span className="text-base font-normal text-gray-400">/mo</span></p>
          <p className="text-sm text-gray-500 mt-1">{fmt(annual)} per year</p>
        </div>
        <Link
          href="/login"
          className="shrink-0 rounded-lg bg-[#204ecf] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1a3fa8] transition-colors"
        >
          Start earning →
        </Link>
      </div>

      <p className="mt-4 text-xs text-center text-gray-400">
        Your AI works the hours you&apos;re not. More sessions become possible when clients can book themselves at 11pm.
      </p>
    </div>
  );
}
