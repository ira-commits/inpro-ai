import { tool } from "ai";
import { z } from "zod";
import { db } from "@/server/db";
import { conversations, consultants } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import type { Service } from "@/server/db/schema";
import { formatCents, formatDuration } from "@/lib/utils";
import { getAvailableSlots, formatAvailability } from "@/lib/cal";

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
      execute: async ({ serviceId }) => {
        // Load consultant's Cal.com username and timezone
        const consultant = await db.query.consultants.findFirst({
          where: eq(consultants.id, consultantId),
        });

        const calUsername = consultant?.calUsername;
        const timezone = consultant?.timezone ?? "UTC";

        // Find the requested service for duration
        const service = serviceId
          ? services.find((s) => s.id === serviceId)
          : services.find((s) => s.isActive);
        const durationMinutes = service?.durationMinutes ?? 60;

        // Attempt to fetch real availability from Cal.com
        if (calUsername) {
          const bookingUrl = `https://cal.com/${calUsername}`;
          const availability = await getAvailableSlots(calUsername, durationMinutes);

          if (availability) {
            const slotsText = formatAvailability(availability, timezone);
            return {
              available: true,
              slots: slotsText,
              bookingUrl,
              message: `Here are the available times for the next week:\n\n${slotsText}\n\nYou can book directly at: ${bookingUrl}`,
            };
          }

          // Cal.com configured but API call failed — give direct booking link
          return {
            available: true,
            bookingUrl,
            message: `You can view live availability and book directly at: ${bookingUrl}`,
          };
        }

        // No Cal.com set up yet — collect email and preferred time
        return {
          available: null,
          requiresEmail: true,
          message:
            "I'd love to get you booked in. Could you share your email address and a couple of times that work for you? I'll confirm the details directly.",
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
