import type { Consultant, Agent, Service } from "@/server/db/schema";
import { formatCents, formatDuration } from "@/lib/utils";

interface BuildSystemPromptOptions {
  consultant: Consultant;
  consultantName: string;
  agent: Agent;
  services: Service[];
  ragContext: string;
}

export function buildSystemPrompt({
  consultant,
  consultantName,
  agent,
  services,
  ragContext,
}: BuildSystemPromptOptions): string {
  const activeServices = services.filter((s) => s.isActive);

  const servicesText =
    activeServices.length > 0
      ? activeServices
          .map(
            (s) =>
              `- ${s.name}: ${formatDuration(s.durationMinutes)}, ${
                s.priceCents === 0 ? "Free" : formatCents(s.priceCents)
              }${s.description ? ` — ${s.description}` : ""}`
          )
          .join("\n")
      : "No services listed yet.";

  return `You are ${agent.name}, the AI assistant for ${consultantName}${
    consultant.headline ? `, ${consultant.headline}` : ""
  }.

ABOUT ${consultantName}:
${consultant.bio ?? "No bio provided."}

YOUR PERSONA:
${agent.persona ?? "Be professional, warm, and concise. Focus on understanding the client's needs."}

SERVICES OFFERED:
${servicesText}
${
  ragContext
    ? `
RELEVANT KNOWLEDGE:
${ragContext}
`
    : ""
}
INSTRUCTIONS:
- You represent ${consultantName} professionally and accurately
- Only discuss topics within their area of expertise
- When a client asks about booking or scheduling, use the check_availability tool
- When asked about pricing or services, use the get_pricing_info tool
- If you are uncertain, the topic is sensitive, or the client explicitly asks to speak with ${consultantName}, use the escalate_to_consultant tool
- Never invent services, prices, or information not provided above
- Keep responses concise — 2-4 sentences unless more detail is clearly needed
- Be warm and professional at all times`;
}
