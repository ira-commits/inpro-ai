import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { db } from "@/server/db";
import {
  consultants,
  agents,
  services,
  conversations,
  messages,
  users,
} from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { buildSystemPrompt } from "@/server/agent/system-prompt";
import { buildTools } from "@/server/agent/tools";
import { getRelevantContext } from "@/server/agent/rag";
import { NextResponse } from "next/server";

const RequestSchema = z.object({
  consultantId: z.string().uuid(),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .min(1),
  conversationId: z.string().uuid().optional(),
  clientEmail: z.string().email().optional(),
});

// Allow cross-origin requests (needed for embeddable widget iframes)
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  // 1. Parse + validate request
  const body = await req.json().catch(() => null);
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400, headers: CORS_HEADERS }
    );
  }
  const { consultantId, messages: clientMessages, conversationId, clientEmail } = parsed.data;

  // 2. Load consultant + agent + services
  const consultant = await db.query.consultants.findFirst({
    where: eq(consultants.id, consultantId),
  });
  if (!consultant) {
    return NextResponse.json(
      { error: "Consultant not found" },
      { status: 404, headers: CORS_HEADERS }
    );
  }

  const agent = await db.query.agents.findFirst({
    where: and(eq(agents.consultantId, consultantId), eq(agents.isActive, true)),
  });
  if (!agent) {
    return NextResponse.json(
      { error: "No active agent found for this consultant" },
      { status: 404, headers: CORS_HEADERS }
    );
  }

  const consultantServices = await db
    .select()
    .from(services)
    .where(eq(services.consultantId, consultantId));

  // Load consultant's display name from users table
  const consultantUser = await db.query.users.findFirst({
    where: eq(users.id, consultant.userId),
  });
  const consultantName = consultantUser?.fullName ?? consultant.slug;

  // 3. Get or create conversation
  let activeConversationId = conversationId;
  if (!activeConversationId) {
    const [newConversation] = await db
      .insert(conversations)
      .values({
        consultantId,
        clientEmail: clientEmail ?? null,
        status: "active",
      })
      .returning({ id: conversations.id });
    activeConversationId = newConversation.id;
  }

  // 4. Save the incoming user message to DB
  const lastMessage = clientMessages[clientMessages.length - 1];
  if (lastMessage.role === "user") {
    await db.insert(messages).values({
      conversationId: activeConversationId,
      role: "user",
      content: lastMessage.content,
    });
  }

  // 5. Build RAG context from the user's last message
  const ragContext = await getRelevantContext(consultantId, lastMessage.content);

  // 6. Build system prompt
  const systemPrompt = buildSystemPrompt({
    consultant,
    consultantName,
    agent,
    services: consultantServices,
    ragContext,
  });

  // 7. Build tools with context closures
  const tools = buildTools({
    consultantId,
    conversationId: activeConversationId,
    services: consultantServices,
  });

  // 8. Stream response from Claude
  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    system: systemPrompt,
    messages: clientMessages,
    tools,
    maxSteps: 5,
    onFinish: async ({ text }) => {
      if (!text) return;
      try {
        await db.insert(messages).values({
          conversationId: activeConversationId!,
          role: "assistant",
          content: text,
        });
      } catch (err) {
        console.error("[agent] Failed to save assistant message", err);
      }
    },
  });

  const response = result.toDataStreamResponse();

  // Attach CORS headers and conversation ID so the client can persist it
  const headers = new Headers(response.headers);
  Object.entries(CORS_HEADERS).forEach(([k, v]) => headers.set(k, v));
  headers.set("X-Conversation-Id", activeConversationId);

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}
