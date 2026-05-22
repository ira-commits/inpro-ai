import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { consultants, conversations, messages } from "@/server/db/schema";
import { eq, desc, and } from "drizzle-orm";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-50 text-green-700 border-green-200",
  booked: "bg-blue-50 text-blue-700 border-blue-200",
  escalated: "bg-red-50 text-red-700 border-red-200",
  closed: "bg-gray-50 text-gray-700 border-gray-200",
};

export default async function InboxPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const consultant = await db.query.consultants.findFirst({
    where: eq(consultants.userId, user.id),
  });
  if (!consultant) redirect("/onboarding");

  const allConversations = await db.query.conversations.findMany({
    where: eq(conversations.consultantId, consultant.id),
    with: {
      messages: {
        orderBy: [desc(messages.createdAt)],
        limit: 1,
      },
    },
    orderBy: [desc(conversations.createdAt)],
    limit: 50,
  });

  const escalated = allConversations.filter((c) => c.status === "escalated");
  const others = allConversations.filter((c) => c.status !== "escalated");

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Inbox</h1>
        <p className="text-muted-foreground mt-1">Client conversations handled by your AI agent.</p>
      </div>

      {escalated.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-destructive uppercase tracking-wide mb-3">
            Needs your attention ({escalated.length})
          </h2>
          <div className="space-y-2">
            {escalated.map((c) => (
              <ConversationRow key={c.id} conversation={c} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          All conversations
        </h2>
        {others.length === 0 && escalated.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground text-sm">No conversations yet.</p>
            <p className="text-muted-foreground text-xs mt-1">Client chats from your AI agent will appear here.</p>
          </div>
        ) : others.length === 0 ? (
          <p className="text-sm text-muted-foreground">No other conversations.</p>
        ) : (
          <div className="space-y-2">
            {others.map((c) => (
              <ConversationRow key={c.id} conversation={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ConversationRow({ conversation }: { conversation: { id: string; clientEmail: string | null; status: string; createdAt: Date; messages: { content: string; role: string }[] } }) {
  const lastMsg = conversation.messages[0];
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 hover:bg-accent transition-colors cursor-pointer">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-medium text-muted-foreground">
            {(conversation.clientEmail ?? "?")[0].toUpperCase()}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {conversation.clientEmail ?? "Anonymous visitor"}
          </p>
          {lastMsg && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {lastMsg.role === "assistant" ? "AI: " : "Client: "}
              {lastMsg.content.slice(0, 80)}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[conversation.status] ?? ""}`}>
          {conversation.status}
        </span>
        <span className="text-xs text-muted-foreground">
          {new Date(conversation.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>
    </div>
  );
}
