import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { consultants, agents, users } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { ChatWidget } from "@/components/agent/chat-widget";

// Allow this page to be embedded in iframes from any origin
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { consultantId: string };
}) {
  const agent = await db.query.agents.findFirst({
    where: and(
      eq(agents.consultantId, params.consultantId),
      eq(agents.isActive, true)
    ),
  });
  return {
    title: agent?.name ?? "AI Assistant",
  };
}

export default async function WidgetPage({
  params,
}: {
  params: { consultantId: string };
}) {
  const consultant = await db.query.consultants.findFirst({
    where: eq(consultants.id, params.consultantId),
  });

  if (!consultant) notFound();

  const agent = await db.query.agents.findFirst({
    where: and(
      eq(agents.consultantId, params.consultantId),
      eq(agents.isActive, true)
    ),
  });

  if (!agent) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-sm text-gray-400">
        This consultant has not activated their AI agent yet.
      </div>
    );
  }

  const consultantUser = await db.query.users.findFirst({
    where: eq(users.id, consultant.userId),
  });
  const consultantName = consultantUser?.fullName ?? consultant.slug;

  return (
    <ChatWidget
      consultantId={params.consultantId}
      agentName={agent.name}
      greeting={
        agent.greeting ??
        `Hi! I'm ${agent.name}, ${consultantName}'s AI assistant. How can I help you today?`
      }
      consultantName={consultantName}
    />
  );
}
