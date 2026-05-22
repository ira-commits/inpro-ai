import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <span className="text-xl font-bold tracking-tight text-[#1a2744]">InPro.ai</span>
        <div className="flex items-center gap-6">
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
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-300 mb-8">
            The Future of Expertise
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight mb-6">
            Clone and monetize<br />
            <span className="text-[#4d8eff]">your expertise</span>
          </h1>
          <p className="text-lg text-blue-100/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Deploy your AI clone to chat with clients 24/7, book sessions, and run your back-office — so your expertise earns while you sleep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="rounded bg-[#204ecf] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[#1a3fa8] transition-colors"
            >
              Deploy your AI clone
            </Link>
            <Link
              href="#how-it-works"
              className="rounded border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              See how it works
            </Link>
          </div>
          <p className="mt-6 text-xs text-blue-200/50">
            Free to start. Pro plan unlocks your full AI agent for $19.95/mo.
          </p>
        </div>
      </section>

      {/* Sam Altman quote */}
      <section className="border-b border-gray-100 bg-[#f7f9fc]">
        <div className="max-w-3xl mx-auto px-8 py-12 text-center">
          <p className="text-lg text-[#1a2744] font-medium leading-relaxed">
            &ldquo;OpenAI CEO Sam Altman predicts the emergence of a &lsquo;one person, billion-dollar company&rsquo; in the near future due to advancements in AI.&rdquo;
          </p>
          <p className="mt-3 text-sm text-gray-400">Sam Altman, CEO of OpenAI</p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-8 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: "1B+", label: "Knowledge workers globally" },
            { value: "175MM", label: "LinkedIn Premium users" },
            { value: "24/7", label: "AI coverage for your clients" },
            { value: "$0", label: "To get started" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-[#1a2744]">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Problem */}
      <section className="max-w-5xl mx-auto px-8 py-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#204ecf] mb-3">The Problem</p>
        <h2 className="text-3xl font-bold text-[#1a2744] mb-4">
          There is no efficient way to sell expertise.
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Professionals spend years building knowledge — then cap their income by the number of hours in a day. InPro.ai breaks that ceiling. Train your AI once, deploy it forever.
        </p>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-[#f7f9fc] py-20">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#204ecf] mb-3">How it works</p>
            <h2 className="text-3xl font-bold text-[#1a2744]">Your AI runs the business.<br />You deliver the expertise.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Train your digital clone",
                description: "Upload your knowledge, set your services and pricing, and define your AI's voice and persona — all in minutes.",
              },
              {
                step: "02",
                title: "Clients chat, book, and pay",
                description: "Your AI qualifies leads, answers questions, checks your calendar, and books sessions with payment automatically.",
              },
              {
                step: "03",
                title: "Earn perpetuity on your knowledge",
                description: "Every session is transcribed, summarised, and fed back into your AI. Your clone gets smarter every day — and so does your income.",
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
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#204ecf] mb-3">Platform</p>
            <h2 className="text-3xl font-bold text-[#1a2744]">Everything you need, nothing you don&apos;t</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: "🤖",
                title: "Professional Expertise Agent",
                description: "Your AI clone trained on your knowledge. Answers questions, qualifies leads, and books sessions — even while you sleep.",
              },
              {
                icon: "🎙",
                title: "Live Session Intel",
                description: "Real-time transcription, AI-generated summaries, action items, and automated follow-up emails after every session.",
              },
              {
                icon: "⚡",
                title: "Back-Office Automation",
                description: "Auto-confirm bookings, send proposals, handle no-shows, and manage scheduling — without touching a keyboard.",
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

      {/* Pricing */}
      <section className="bg-[#f7f9fc] py-20">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#204ecf] mb-3">Pricing</p>
            <h2 className="text-3xl font-bold text-[#1a2744]">Start free. Scale with AI.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Starter */}
            <div className="rounded-lg border border-gray-200 bg-white p-8">
              <h3 className="text-lg font-bold text-[#1a2744] mb-1">Starter</h3>
              <div className="text-3xl font-bold text-[#1a2744] mb-1">Free</div>
              <p className="text-sm text-gray-400 mb-6">+ 5% per transaction</p>
              <ul className="space-y-2 text-sm text-gray-600">
                {["Public profile", "Payments", "Scheduling", "Invoicing"].map((f) => (
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
                {["AI Agent (your digital clone)", "Profile, Payments, Scheduling", "Invoicing", "Community access"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-[#204ecf]">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="mt-8 block text-center rounded bg-[#204ecf] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1a3fa8] transition-colors"
              >
                Deploy your AI clone
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1a2744] text-white py-20">
        <div className="max-w-2xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Scale your expertise with no limit.</h2>
          <p className="text-blue-100/70 mb-8">
            Join thousands of professionals who are deploying their AI clone and earning perpetuity on their knowledge.
          </p>
          <Link
            href="/login"
            className="inline-block rounded bg-[#204ecf] px-10 py-4 text-sm font-semibold text-white hover:bg-[#1a3fa8] transition-colors"
          >
            Get started — it&apos;s free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-8 flex items-center justify-between">
          <span className="text-sm font-bold text-[#1a2744]">InPro.ai</span>
          <p className="text-xs text-gray-400">© 2026 InPro.ai. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
