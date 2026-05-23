"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

// Live ticker — counts up from 900,000 to simulate ongoing AI job displacement
function useJobCounter() {
  const [count, setCount] = useState(900_000);
  useEffect(() => {
    function tick() {
      setCount((c) => c + Math.floor(Math.random() * 4) + 1);
      setTimeout(tick, 1200 + Math.random() * 1800);
    }
    const t = setTimeout(tick, 1500);
    return () => clearTimeout(t);
  }, []);
  return count.toLocaleString("en-US");
}

export default function HomePage() {
  const jobCount = useJobCounter();

  return (
    <main className="min-h-screen bg-[#F3F2EF] font-sans">

      {/* Live ticker bar */}
      <div className="bg-[#C0392B] text-white text-xs sm:text-sm font-semibold text-center py-2.5 px-4 flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-white/60 animate-pulse shrink-0" />
        AI has eliminated <span className="font-black tabular-nums mx-1">{jobCount}</span> jobs since 2023 — and counting
      </div>

      {/* Nav */}
      <nav className="bg-white border-b border-[#E0DFDC] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Image src="/logo.png" alt="InPro.ai" width={100} height={44} priority />
          <div className="flex items-center gap-4">
            <Link href="/consultants" className="hidden sm:block text-sm font-medium text-[#666666] hover:text-[#0A66C2] transition-colors">
              Find experts
            </Link>
            <Link href="/login" className="text-sm font-semibold text-[#0A66C2] hover:underline transition-colors">
              Sign in
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-[#0A66C2] px-5 py-2 text-sm font-semibold text-white hover:bg-[#004182] transition-colors"
            >
              Join now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-white border-b border-[#E0DFDC]">
        <div className="max-w-6xl mx-auto px-6 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF3FB] px-4 py-1.5 text-xs font-semibold text-[#0A66C2] uppercase tracking-widest mb-6">
              The professional network for consultants
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-[#191919] leading-tight tracking-tight mb-5">
              Join the world&apos;s top<br />
              <span className="text-[#0A66C2]">independent consultants.</span>
            </h1>
            <p className="text-base text-[#666666] leading-relaxed mb-8 max-w-md">
              Your AI agent handles clients 24/7, books sessions, and runs your back-office — so you focus on the work that only you can do.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 rounded-full bg-[#0A66C2] px-8 py-3.5 text-sm font-bold text-white hover:bg-[#004182] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Continue with LinkedIn
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center rounded-full border-2 border-[#0A66C2] px-8 py-3.5 text-sm font-bold text-[#0A66C2] hover:bg-[#EEF3FB] transition-colors"
              >
                Start with email
              </Link>
            </div>
            <p className="mt-4 text-xs text-[#999999]">Free to start. No resume required. Live in 3 minutes.</p>
          </div>

          {/* Right: LinkedIn-style profile card mockup */}
          <div className="hidden lg:block">
            <div className="rounded-xl border border-[#E0DFDC] bg-white shadow-lg overflow-hidden max-w-sm mx-auto">
              {/* Card banner */}
              <div className="h-20 bg-gradient-to-r from-[#0A66C2] to-[#004182]" />
              <div className="px-6 pb-6">
                <div className="-mt-10 mb-4 flex items-end justify-between">
                  <div className="w-20 h-20 rounded-full border-4 border-white bg-[#0A66C2] flex items-center justify-center text-white text-2xl font-bold shadow">
                    S
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-[#EEF3FB] px-3 py-1 text-xs font-semibold text-[#0A66C2]">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    AI Active
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#191919]">Sarah Chen</h3>
                <p className="text-sm text-[#666666]">Product Strategy Consultant</p>
                <p className="text-xs text-[#999999] mt-0.5">ex-Google · ex-Meta</p>
                <div className="mt-4 rounded-lg bg-[#F3F2EF] p-3 text-xs text-[#666666]">
                  <p className="font-semibold text-[#191919] mb-1">SarahAI is online</p>
                  <p>"Hi! I&apos;m Sarah&apos;s AI. Ask me anything about product strategy or book a session below."</p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-[#F3F2EF] px-3 py-2">
                    <p className="font-bold text-[#191919] text-base">47</p>
                    <p className="text-[#999999]">sessions this month</p>
                  </div>
                  <div className="rounded-lg bg-[#F3F2EF] px-3 py-2">
                    <p className="font-bold text-[#191919] text-base">4.9★</p>
                    <p className="text-[#999999]">client rating</p>
                  </div>
                </div>
                <Link href="/login" className="mt-4 block w-full text-center rounded-full bg-[#0A66C2] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#004182] transition-colors">
                  Book a session
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="bg-[#F3F2EF] border-b border-[#E0DFDC]">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#999999] mb-6">Trusted by professionals from</p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-semibold text-[#666666]">
            {["Google", "Meta", "Amazon", "McKinsey", "Deloitte", "Salesforce"].map((co) => (
              <span key={co}>{co}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-[#E0DFDC]">
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: "900K+", label: "Professionals displaced by AI" },
            { value: "3 min", label: "To launch your profile" },
            { value: "24/7", label: "Your AI works while you sleep" },
            { value: "$0", label: "To get started" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-black text-[#0A66C2]">{stat.value}</p>
              <p className="mt-1 text-sm text-[#666666]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#F3F2EF] border-b border-[#E0DFDC] py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0A66C2] mb-3">How it works</p>
            <h2 className="text-3xl font-black text-[#191919]">From LinkedIn to live in 3 minutes.</h2>
            <p className="mt-3 text-sm text-[#666666]">Your LinkedIn profile is your resume. InPro turns it into a business.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Connect your LinkedIn",
                description: "Sign in and your name, photo, headline, and experience import automatically. No resume needed.",
              },
              {
                step: "02",
                title: "Train your AI in minutes",
                description: "Tell your AI your expertise, services, and pricing. It starts qualifying clients and booking sessions immediately.",
              },
              {
                step: "03",
                title: "Share your link, get paid",
                description: "Post your InPro link on LinkedIn. Your AI handles the rest — answering questions and booking sessions around the clock.",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-xl bg-white border border-[#E0DFDC] p-7 shadow-sm">
                <p className="text-4xl font-black text-[#E0DFDC] mb-4">{item.step}</p>
                <h3 className="text-base font-bold text-[#191919] mb-2">{item.title}</h3>
                <p className="text-sm text-[#666666] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings calculator */}
      <section className="bg-white border-b border-[#E0DFDC] py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0A66C2] mb-3">Your potential</p>
            <h2 className="text-3xl font-black text-[#191919]">What could you earn?</h2>
            <p className="mt-3 text-sm text-[#666666]">Adjust the sliders to see your projected consulting income.</p>
          </div>
          <EarningsCalculator />
        </div>
      </section>

      {/* Old way vs new way */}
      <section className="bg-[#F3F2EF] border-b border-[#E0DFDC] py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0A66C2] mb-3">The shift</p>
            <h2 className="text-3xl font-black text-[#191919]">The old consulting model is broken.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="rounded-xl border border-[#E0DFDC] bg-white p-7 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-[#999999] mb-5">Before InPro</p>
              <ul className="space-y-3 text-sm text-[#666666]">
                {[
                  "Months of networking to find one client",
                  "Phone tag just to schedule a call",
                  "Answer the same questions 100 times",
                  "Miss leads while you sleep",
                  "Income capped by hours in a day",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 text-red-400 font-bold shrink-0">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border-2 border-[#0A66C2] bg-white p-7 shadow-sm relative">
              <div className="absolute -top-3.5 left-6 rounded-full bg-[#0A66C2] px-3 py-1 text-xs font-bold text-white">With InPro.ai</div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#0A66C2] mb-5">After InPro</p>
              <ul className="space-y-3 text-sm text-[#666666]">
                {[
                  "Live profile on LinkedIn in 3 minutes",
                  "AI books sessions while you're offline",
                  "AI answers from your knowledge base",
                  "Zero missed leads — your AI never sleeps",
                  "Income scales with AI, not your calendar",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 text-[#0A66C2] font-bold shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Platform pillars */}
      <section className="bg-white border-b border-[#E0DFDC] py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0A66C2] mb-3">Platform</p>
            <h2 className="text-3xl font-black text-[#191919]">Your AI runs the business.<br />You deliver the expertise.</h2>
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
                description: "Every session is transcribed, summarised, and fed back into your AI. Your knowledge base gets richer every session.",
              },
              {
                icon: "⚡",
                title: "Back-office on autopilot",
                description: "Auto-confirm bookings, send follow-ups, generate proposals, re-book no-shows. All automatic.",
              },
            ].map((pillar) => (
              <div key={pillar.title} className="rounded-xl border border-[#E0DFDC] bg-[#F3F2EF] p-7">
                <span className="text-2xl mb-4 block">{pillar.icon}</span>
                <h3 className="font-bold text-[#191919] mb-2">{pillar.title}</h3>
                <p className="text-sm text-[#666666] leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-[#F3F2EF] border-b border-[#E0DFDC]">
        <div className="max-w-3xl mx-auto px-6 py-14 text-center">
          <p className="text-xl font-bold text-[#191919] leading-relaxed">
            &ldquo;The emergence of a &lsquo;one person, billion-dollar company&rsquo; is coming — enabled entirely by AI.&rdquo;
          </p>
          <p className="mt-3 text-sm text-[#999999]">Sam Altman, CEO of OpenAI</p>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white border-b border-[#E0DFDC] py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0A66C2] mb-3">Pricing</p>
            <h2 className="text-3xl font-black text-[#191919]">Start free. Scale with AI.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="rounded-xl border border-[#E0DFDC] bg-white p-8 shadow-sm">
              <h3 className="text-lg font-bold text-[#191919] mb-1">Starter</h3>
              <div className="text-3xl font-black text-[#191919] mb-1">Free</div>
              <p className="text-sm text-[#999999] mb-6">+ 5% per transaction</p>
              <ul className="space-y-2 text-sm text-[#666666]">
                {["Public profile", "Payments via Stripe", "Scheduling via Cal.com", "Invoicing"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-[#0A66C2] font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="mt-8 block text-center rounded-full border-2 border-[#0A66C2] px-6 py-2.5 text-sm font-bold text-[#0A66C2] hover:bg-[#EEF3FB] transition-colors">
                Get started free
              </Link>
            </div>
            <div className="rounded-xl border-2 border-[#0A66C2] bg-white p-8 shadow-sm relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#0A66C2] px-3 py-1 text-xs font-bold text-white whitespace-nowrap">
                Most popular
              </div>
              <h3 className="text-lg font-bold text-[#191919] mb-1">Pro</h3>
              <div className="text-3xl font-black text-[#191919] mb-1">$19.95<span className="text-base font-normal text-[#999999]">/mo</span></div>
              <p className="text-sm text-[#999999] mb-6">Unlock your AI agent</p>
              <ul className="space-y-2 text-sm text-[#666666]">
                {["AI Agent (answers, qualifies, books)", "Profile, Payments, Scheduling", "Session transcription + AI summaries", "Automated follow-ups & proposals"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-[#0A66C2] font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="mt-8 block text-center rounded-full bg-[#0A66C2] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#004182] transition-colors">
                Launch your practice
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0A66C2] text-white py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-4">Your next chapter starts today</p>
          <h2 className="text-3xl font-black mb-4">Your expertise deserves<br />a global audience.</h2>
          <p className="text-white/80 mb-8">
            Join thousands of professionals who turned industry knowledge into independent income — with AI doing the heavy lifting.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-white px-10 py-4 text-sm font-black text-[#0A66C2] hover:bg-[#EEF3FB] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Join with LinkedIn — it&apos;s free
          </Link>
          <p className="mt-4 text-xs text-white/40">Live in 3 minutes. No resume required.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E0DFDC] py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <Image src="/logo.png" alt="InPro.ai" width={80} height={36} />
          <p className="text-xs text-[#999999]">© 2026 InPro.ai. All rights reserved.</p>
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
    <div className="rounded-2xl border border-[#E0DFDC] bg-white p-8 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-[#191919]">Sessions per month</label>
            <span className="text-lg font-black text-[#0A66C2]">{sessions}</span>
          </div>
          <input
            type="range"
            min={1}
            max={40}
            value={sessions}
            onChange={(e) => setSessions(Number(e.target.value))}
            className="w-full accent-[#0A66C2]"
          />
          <div className="flex justify-between text-xs text-[#999999] mt-1">
            <span>1</span><span>40</span>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-[#191919]">Rate per session</label>
            <span className="text-lg font-black text-[#0A66C2]">${rate}</span>
          </div>
          <input
            type="range"
            min={50}
            max={1000}
            step={25}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-[#0A66C2]"
          />
          <div className="flex justify-between text-xs text-[#999999] mt-1">
            <span>$50</span><span>$1,000</span>
          </div>
        </div>
      </div>
      <div className="rounded-xl bg-[#EEF3FB] px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#0A66C2] mb-1">Your projected income</p>
          <p className="text-4xl font-black text-[#191919]">{fmt(monthly)}<span className="text-base font-normal text-[#999999]">/mo</span></p>
          <p className="text-sm text-[#666666] mt-1">{fmt(annual)} per year</p>
        </div>
        <Link
          href="/login"
          className="shrink-0 rounded-full bg-[#0A66C2] px-6 py-3 text-sm font-bold text-white hover:bg-[#004182] transition-colors"
        >
          Start earning →
        </Link>
      </div>
      <p className="mt-4 text-xs text-center text-[#999999]">
        Your AI works the hours you&apos;re not. More sessions become possible when clients can book themselves at 11pm.
      </p>
    </div>
  );
}
