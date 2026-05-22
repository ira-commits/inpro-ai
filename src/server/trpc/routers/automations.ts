import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { automations, consultants } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

export const automationsRouter = createTRPCRouter({
  toggle: protectedProcedure
    .input(
      z.object({
        type: z.enum([
          "auto_confirm_booking",
          "post_session_followup",
          "proposal_generator",
          "no_show_rebooking",
        ]),
        isEnabled: z.boolean(),
        consultantId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.automations.findFirst({
        where: and(
          eq(automations.consultantId, input.consultantId),
          eq(automations.type, input.type)
        ),
      });

      if (existing) {
        const [updated] = await ctx.db
          .update(automations)
          .set({ isEnabled: input.isEnabled })
          .where(eq(automations.id, existing.id))
          .returning();
        return updated;
      }

      const [created] = await ctx.db
        .insert(automations)
        .values({
          consultantId: input.consultantId,
          type: input.type,
          isEnabled: input.isEnabled,
        })
        .returning();
      return created;
    }),
});
