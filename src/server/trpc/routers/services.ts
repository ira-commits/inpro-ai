import { z } from "zod";
import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { services, consultants } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

export const servicesRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const consultant = await ctx.db.query.consultants.findFirst({
      where: eq(consultants.userId, ctx.user.id),
    });
    if (!consultant) throw new TRPCError({ code: "NOT_FOUND" });

    return ctx.db.query.services.findMany({
      where: eq(services.consultantId, consultant.id),
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(200),
        description: z.string().max(1000).optional(),
        durationMinutes: z.number().int().min(15).max(480),
        priceCents: z.number().int().min(0),
        currency: z.string().default("usd"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const consultant = await ctx.db.query.consultants.findFirst({
        where: eq(consultants.userId, ctx.user.id),
      });
      if (!consultant) throw new TRPCError({ code: "NOT_FOUND" });

      const [created] = await ctx.db
        .insert(services)
        .values({ ...input, consultantId: consultant.id })
        .returning();
      return created;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).max(200).optional(),
        description: z.string().max(1000).optional(),
        durationMinutes: z.number().int().min(15).max(480).optional(),
        priceCents: z.number().int().min(0).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [updated] = await ctx.db
        .update(services)
        .set(data)
        .where(eq(services.id, id))
        .returning();
      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(services).where(eq(services.id, input.id));
      return { success: true };
    }),
});
