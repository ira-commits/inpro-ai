import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { consultants, agents, knowledgeChunks } from "@/server/db/schema";
import { eq, count } from "drizzle-orm";
import { AgentConfigForm } from "@/components/consultant/agent-config-form";
import { KnowledgeBasePanel } from "@/components/consultant/knowledge-base-panel";
import { AgentTabs } from "@/components/consultant/agent-tabs";

export default async function AgentPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const consultant = await db.query.consultants.findFirst({
    where: eq(consultants.userId, user.id),
  });
  if (!consultant) redirect("/onboarding");

  const agent = await db.query.agents.findFirst({
    where: eq(agents.consultantId, consultant.id),
  });

  const [chunkCount] = await db
    .select({ count: count() })
    .from(knowledgeChunks)
    .where(eq(knowledgeChunks.consultantId, consultant.id));

  const params = await searchParams;
  const activeTab = params.tab ?? "resume";

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">AI Agent</h1>
        <p className="text-muted-foreground mt-1">
          Train your agent, configure its personality, and manage its knowledge base.
        </p>
      </div>

      <AgentTabs
        activeTab={activeTab}
        agent={agent}
        consultantId={consultant.id}
        chunkCount={chunkCount?.count ?? 0}
      />
    </div>
  );
}
