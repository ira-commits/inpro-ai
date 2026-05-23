import { z } from "zod";
import { eq, ilike, or, and } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { consultants, services, agents, users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

export const consultantsRouter = createTRPCRouter({
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const consultant = await ctx.db.query.consultants.findFirst({
        where: eq(consultants.slug, input.slug),
        with: {
          services: {
            where: eq(services.isActive, true),
          },
          agents: {
            where: eq(agents.isActive, true),
            limit: 1,
          },
          user: true,
        },
      });

      if (!consultant) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return consultant;
    }),

  // Browse / search published consultants
  search: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query, limit, offset } = input;

      // Pull published consultants with their user record + services
      const rows = await ctx.db.query.consultants.findMany({
        where: and(
          eq(consultants.isPublished, true),
          query
            ? or(
                ilike(consultants.headline, `%${query}%`),
                ilike(consultants.bio, `%${query}%`),
                ilike(consultants.slug, `%${query}%`)
              )
            : undefined
        ),
        with: {
          services: { where: eq(services.isActive, true) },
          agents: { where: eq(agents.isActive, true), limit: 1 },
          user: true,
        },
        limit,
        offset,
      });

      return rows;
    }),

  getMyProfile: protectedProcedure.query(async ({ ctx }) => {
    const consultant = await ctx.db.query.consultants.findFirst({
      where: eq(consultants.userId, ctx.user.id),
      with: {
        services: true,
        agents: true,
        automations: true,
      },
    });

    return consultant ?? null;
  }),

  upsertProfile: protectedProcedure
    .input(
      z.object({
        slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/),
        bio: z.string().max(1000).optional(),
        headline: z.string().max(200).optional(),
        timezone: z.string().optional(),
        calUsername: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.consultants.findFirst({
        where: eq(consultants.userId, ctx.user.id),
      });

      if (existing) {
        const [updated] = await ctx.db
          .update(consultants)
          .set(input)
          .where(eq(consultants.userId, ctx.user.id))
          .returning();
        return updated;
      }

      const [created] = await ctx.db
        .insert(consultants)
        .values({ ...input, userId: ctx.user.id })
        .returning();
      return created;
    }),

  publish: protectedProcedure.mutation(async ({ ctx }) => {
    const [updated] = await ctx.db
      .update(consultants)
      .set({ isPublished: true })
      .where(eq(consultants.userId, ctx.user.id))
      .returning();
    return updated;
  }),
});
