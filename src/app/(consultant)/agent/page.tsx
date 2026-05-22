import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { consultants, agents, knowledgeChunks } from "@/server/db/schema";
import { eq, count } from "drizzle-orm";
import { AgentConfigForm } from "@/components/consultant/agent-config-form";
import { KnowledgeBasePanel } from "@/components/consultant/knowledge-base-panel";

export default async function AgentPage() {
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

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">AI Agent</h1>
        <p className="text-muted-foreground mt-1">
          Configure your agent&apos;s personality, knowledge, and behaviour.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-base font-semibold text-foreground mb-3">Agent settings</h2>
          <AgentConfigForm agent={agent} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground mb-3">
            Knowledge base
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {chunkCount?.count ?? 0} entries
            </span>
          </h2>
          <KnowledgeBasePanel consultantId={consultant.id} />
        </div>
      </div>
    </div>
  );
}
