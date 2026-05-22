import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { consultants, sessions, conversations } from "@/server/db/schema";
import { eq, and, gte, count } from "drizzle-orm";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const consultant = await db.query.consultants.findFirst({
    where: eq(consultants.userId, user.id),
    with: { agents: true },
  });

  if (!consultant) redirect("/onboarding");

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [upcomingSessions, activeConversations, monthSessions] =
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
    ]);

  const agent = consultant.agents?.[0];

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back. Here&apos;s what&apos;s happening with your practice.
        </p>
      </div>

      {/* Agent status banner */}
      {agent ? (
        <div className={`mb-6 flex items-center justify-between rounded-lg border px-5 py-4 ${agent.isActive ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}`}>
          <div className="flex items-center gap-3">
            <div className={`h-2.5 w-2.5 rounded-full ${agent.isActive ? "bg-green-500" : "bg-yellow-500"}`} />
            <div>
              <p className="text-sm font-medium text-foreground">
                {agent.name} is {agent.isActive ? "active and taking conversations" : "currently paused"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {agent.isActive ? "Your AI is live on your public profile" : "Turn on your agent to start receiving client chats"}
              </p>
            </div>
          </div>
          <Link href="/agent" className="text-sm font-medium text-primary hover:underline">
            Manage agent
          </Link>
        </div>
      ) : (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-dashed border-border px-5 py-4">
          <div>
            <p className="text-sm font-medium text-foreground">No AI agent configured yet</p>
            <p className="text-xs text-muted-foreground mt-0.5">Set up your agent to start chatting with clients 24/7</p>
          </div>
          <Link href="/agent" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Set up agent
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        <StatCard label="Upcoming sessions" value={upcomingSessions[0]?.count ?? 0} href="/sessions" linkLabel="View schedule" />
        <StatCard label="Active conversations" value={activeConversations[0]?.count ?? 0} href="/inbox" linkLabel="Open inbox" />
        <StatCard label="Sessions this month" value={monthSessions[0]?.count ?? 0} href="/sessions" linkLabel="View all" />
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Quick actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <QuickLink href="/agent" title="Train your AI" description="Add knowledge, update persona, edit your agent&apos;s greeting" icon="🤖" />
          <QuickLink href="/automations" title="Configure automations" description="Auto-confirm bookings, send follow-ups, generate proposals" icon="⚡" />
          <QuickLink href="/sessions" title="View sessions" description="See upcoming sessions and past session summaries" icon="🎙" />
          <QuickLink href={`/${consultant.slug}`} title="Preview your public page" description="See what clients see when they visit your profile" icon="👁" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, href, linkLabel }: { label: string; value: number; href: string; linkLabel: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
      <Link href={href} className="mt-2 inline-block text-xs font-medium text-primary hover:underline">{linkLabel} →</Link>
    </div>
  );
}

function QuickLink({ href, title, description, icon }: { href: string; title: string; description: string; icon: string }) {
  return (
    <Link href={href} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 hover:bg-accent transition-colors">
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </Link>
  );
}
