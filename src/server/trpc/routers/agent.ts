import { z } from "zod";
import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { agents, consultants } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

export const agentRouter = createTRPCRouter({
  getConfig: protectedProcedure.query(async ({ ctx }) => {
    const consultant = await ctx.db.query.consultants.findFirst({
      where: eq(consultants.userId, ctx.user.id),
    });

    if (!consultant) throw new TRPCError({ code: "NOT_FOUND" });

    const agent = await ctx.db.query.agents.findFirst({
      where: eq(agents.consultantId, consultant.id),
    });

    return agent ?? null;
  }),

  upsertConfig: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        persona: z.string().max(2000).optional(),
        greeting: z.string().max(500).optional(),
        escalationThreshold: z.number().min(0).max(1).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const consultant = await ctx.db.query.consultants.findFirst({
        where: eq(consultants.userId, ctx.user.id),
      });

      if (!consultant) throw new TRPCError({ code: "NOT_FOUND" });

      const existing = await ctx.db.query.agents.findFirst({
        where: eq(agents.consultantId, consultant.id),
      });

      if (existing) {
        const [updated] = await ctx.db
          .update(agents)
          .set(input)
          .where(eq(agents.consultantId, consultant.id))
          .returning();
        return updated;
      }

      const [created] = await ctx.db
        .insert(agents)
        .values({ ...input, consultantId: consultant.id })
        .returning();
      return created;
    }),
});
