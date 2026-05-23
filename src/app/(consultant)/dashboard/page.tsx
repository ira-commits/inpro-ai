import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { consultants, sessions, conversations, knowledgeChunks } from "@/server/db/schema";
import { eq, and, gte, count } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { PublishButton } from "@/components/consultant/publish-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const consultant = await db.query.consultants.findFirst({
    where: eq(consultants.userId, user.id),
    with: { agents: true, services: true, user: true },
  });

  if (!consultant) redirect("/onboarding");

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [upcomingSessions, activeConversations, monthSessions, knowledgeCount] =
    await Promise.all([
      db.select({ count: count() }).from(sessions).where(
        and(eq(sessions.consultantId, consultant.id), eq(sessions.status, "scheduled"), gte(sessions.scheduledAt, now))
      ),
      db.select({ count: count() }).from(conversations).where(
        and(eq(conversations.consultantId, consultant.id), eq(conversations.status, "active"))
      ),
      db.select({ count: count() }).from(sessions).where(
        and(eq(sessions.consultantId, consultant.id), gte(sessions.scheduledAt, startOfMonth))
      ),
      db.select({ count: count() }).from(knowledgeChunks).where(
        eq(knowledgeChunks.consultantId, consultant.id)
      ),
    ]);

  const agent = consultant.agents?.[0];
  const name = consultant.user?.fullName ?? consultant.slug;
  const avatar = consultant.user?.avatarUrl;
  const firstName = name.split(" ")[0];

  // Setup checklist
  const checks = {
    profile: !!consultant.headline,
    services: (consultant.services?.length ?? 0) > 0,
    agent: !!agent,
    knowledge: (knowledgeCount[0]?.count ?? 0) > 0,
    published: consultant.isPublished,
  };
  const completedChecks = Object.values(checks).filter(Boolean).length;
  const allDone = completedChecks === 5;

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#204ecf] text-sm font-bold text-white">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-lg font-bold text-[#1a2744]">
              Hey, {firstName}
            </h1>
            <p className="text-xs text-gray-500">
              {consultant.isPublished
                ? `Live at inpro.ai/${consultant.slug}`
                : "Your profile isn't live yet"}
            </p>
          </div>
        </div>
        <PublishButton
          isPublished={consultant.isPublished}
          slug={consultant.slug}
          name={name}
          headline={consultant.headline}
        />
      </div>

      {/* Go-live banner — only when not published */}
      {!consultant.isPublished && (
        <div className="mb-6 rounded-xl border border-[#204ecf]/20 bg-[#f0f4ff] px-5 py-4">
          <div className="flex items-start gap-4">
            <div className="shrink-0 mt-0.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#204ecf]/10">
                <svg className="h-4 w-4 text-[#204ecf]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#1a2744]">
                {allDone ? "You're ready to go live!" : `${completedChecks} of 5 steps complete`}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {allDone
                  ? "Hit \"Go live\" above and your profile will appear in search."
                  : "Complete the steps below before publishing your profile."}
              </p>
            </div>
            <span className="text-xs font-bold text-[#204ecf]">
              {completedChecks}/5
            </span>
          </div>

          {/* Checklist */}
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
            <CheckItem done={checks.profile} label="Add headline" href="/settings" />
            <CheckItem done={checks.services} label="Add a service" href="/services" />
            <CheckItem done={checks.agent} label="Configure AI" href="/agent" />
            <CheckItem done={checks.knowledge} label="Train AI" href="/agent" />
            <CheckItem done={checks.published} label="Go live" href="#" />
          </div>
        </div>
      )}

      {/* Live banner */}
      {consultant.isPublished && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
            <p className="text-sm font-medium text-green-800">
              Your profile is live — clients can find you and chat with your AI
            </p>
          </div>
          <a
            href={`/${consultant.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-green-700 hover:underline shrink-0 ml-4"
          >
            View profile →
          </a>
        </div>
      )}

      {/* Agent status */}
      {agent ? (
        <div className={`mb-6 flex items-center justify-between rounded-xl border px-5 py-3.5 ${agent.isActive ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}`}>
          <div className="flex items-center gap-2.5">
            <div className={`h-2.5 w-2.5 rounded-full ${agent.isActive ? "bg-green-500" : "bg-yellow-400"}`} />
            <div>
              <p className="text-sm font-medium text-[#1a2744]">
                {agent.name} is {agent.isActive ? "active" : "paused"}
              </p>
              <p className="text-xs text-gray-500">
                {agent.isActive ? "Taking conversations 24/7" : "Turn on to start receiving client chats"}
              </p>
            </div>
          </div>
          <Link href="/agent" className="text-xs font-semibold text-[#204ecf] hover:underline">
            Manage →
          </Link>
        </div>
      ) : (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-dashed border-gray-300 px-5 py-4">
          <div>
            <p className="text-sm font-medium text-[#1a2744]">No AI agent configured</p>
            <p className="text-xs text-gray-500 mt-0.5">Set up your agent to chat with clients 24/7</p>
          </div>
          <Link href="/agent" className="rounded-lg bg-[#204ecf] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1a3fb5] transition-colors">
            Set up AI
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <StatCard
          label="Upcoming sessions"
          value={upcomingSessions[0]?.count ?? 0}
          href="/sessions"
          linkLabel="View schedule"
          icon={<CalIcon />}
        />
        <StatCard
          label="Active conversations"
          value={activeConversations[0]?.count ?? 0}
          href="/inbox"
          linkLabel="Open inbox"
          icon={<ChatIcon />}
        />
        <StatCard
          label="Sessions this month"
          value={monthSessions[0]?.count ?? 0}
          href="/sessions"
          linkLabel="View all"
          icon={<TrendIcon />}
        />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Quick actions
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <QuickLink
            href="/agent"
            title="Train your AI"
            description="Add knowledge, FAQs, and your methodology so your AI knows your expertise"
            badge={knowledgeCount[0]?.count ? `${knowledgeCount[0].count} entries` : "Empty"}
            badgeColor={knowledgeCount[0]?.count ? "green" : "yellow"}
          />
          <QuickLink
            href="/automations"
            title="Configure automations"
            description="Auto-confirm bookings, send follow-ups, generate proposals"
          />
          <QuickLink
            href="/sessions"
            title="Sessions"
            description="Upcoming schedule and past session summaries"
          />
          <QuickLink
            href={`/${consultant.slug}`}
            title="Preview your profile"
            description="See exactly what clients see when they visit your page"
            external
          />
        </div>
      </div>
    </div>
  );
}

function CheckItem({ done, label, href }: { done: boolean; label: string; href: string }) {
  return (
    <Link
      href={done ? "#" : href}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
        done
          ? "bg-green-100 text-green-700 cursor-default"
          : "bg-white border border-gray-200 text-gray-600 hover:border-[#204ecf] hover:text-[#204ecf]"
      }`}
    >
      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${done ? "bg-green-500" : "border border-gray-300"}`}>
        {done && (
          <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      {label}
    </Link>
  );
}

function StatCard({
  label,
  value,
  href,
  linkLabel,
  icon,
}: {
  label: string;
  value: number;
  href: string;
  linkLabel: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <span className="text-gray-300">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-[#1a2744]">{value}</p>
      <Link href={href} className="mt-2 inline-block text-xs font-medium text-[#204ecf] hover:underline">
        {linkLabel} →
      </Link>
    </div>
  );
}

function QuickLink({
  href,
  title,
  description,
  badge,
  badgeColor,
  external,
}: {
  href: string;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: "green" | "yellow";
  external?: boolean;
}) {
  const props = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Link
      href={href}
      {...props}
      className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:border-[#204ecf]/40 hover:shadow-sm transition-all"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#1a2744]">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>
      </div>
      {badge && (
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
            badgeColor === "green"
              ? "bg-green-50 text-green-700"
              : "bg-yellow-50 text-yellow-700"
          }`}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

function CalIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
