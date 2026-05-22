import { tool } from "ai";
import { z } from "zod";
import { db } from "@/server/db";
import { conversations } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import type { Service } from "@/server/db/schema";
import { formatCents, formatDuration } from "@/lib/utils";

interface ToolContext {
  consultantId: string;
  conversationId: string;
  services: Service[];
}

export function buildTools(context: ToolContext) {
  const { consultantId, conversationId, services } = context;

  return {
    get_pricing_info: tool({
      description:
        "Get the full list of services, prices, and durations offered by this consultant. Use this when a client asks about pricing, services, packages, or what is available.",
      parameters: z.object({}),
      execute: async () => {
        const active = services.filter((s) => s.isActive);
        if (active.length === 0) {
          return { services: [], message: "No services are currently listed." };
        }
        return {
          services: active.map((s) => ({
            name: s.name,
            duration: formatDuration(s.durationMinutes),
            price: s.priceCents === 0 ? "Free" : formatCents(s.priceCents),
            description: s.description ?? "",
          })),
        };
      },
    }),

    check_availability: tool({
      description:
        "Check availability for a session booking. Use this when a client asks about scheduling, available times, or wants to book a session.",
      parameters: z.object({
        serviceId: z
          .string()
          .optional()
          .describe("The service ID the client wants to book, if known"),
        preferredDate: z
          .string()
          .optional()
          .describe("The client's preferred date in natural language, e.g. 'next Tuesday'"),
      }),
      execute: async ({ serviceId, preferredDate }) => {
        // Cal.com integration goes here — returning a placeholder for now
        void serviceId;
        void preferredDate;
        return {
          message:
            "Calendar booking is being set up. For now, please provide your email and preferred time and I'll pass this directly to the consultant to confirm.",
          requiresEmail: true,
        };
      },
    }),

    escalate_to_consultant: tool({
      description:
        "Escalate this conversation to the human consultant. Use this when: the client explicitly asks to speak with the consultant, the question is outside your knowledge, the topic is sensitive or requires personal judgment, or the client seems frustrated.",
      parameters: z.object({
        reason: z
          .string()
          .describe("Why you are escalating — be specific so the consultant can prepare"),
      }),
      execute: async ({ reason }) => {
        try {
          await db
            .update(conversations)
            .set({ status: "escalated" })
            .where(eq(conversations.id, conversationId));
        } catch {
          // non-fatal — log and continue
          console.error("[agent] Failed to update conversation status to escalated", {
            conversationId,
            consultantId,
          });
        }

        return {
          escalated: true,
          reason,
          message:
            "I've flagged this conversation for the consultant. They'll follow up with you directly — usually within a few hours.",
        };
      },
    }),
  };
}
