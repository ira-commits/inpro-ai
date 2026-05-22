import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { sessions, consultants } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

export const sessionsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        status: z
          .enum(["scheduled", "live", "completed", "cancelled", "no_show"])
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const consultant = await ctx.db.query.consultants.findFirst({
        where: eq(consultants.userId, ctx.user.id),
      });

      if (!consultant) throw new TRPCError({ code: "NOT_FOUND" });

      const conditions = [eq(sessions.consultantId, consultant.id)];
      if (input.status) {
        conditions.push(eq(sessions.status, input.status));
      }

      return ctx.db.query.sessions.findMany({
        where: and(...conditions),
        with: { service: true },
        orderBy: [desc(sessions.scheduledAt)],
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const session = await ctx.db.query.sessions.findFirst({
        where: eq(sessions.id, input.id),
        with: {
          service: true,
          transcript: true,
        },
      });

      if (!session) throw new TRPCError({ code: "NOT_FOUND" });
      return session;
    }),
});
