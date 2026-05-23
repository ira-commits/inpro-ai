import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { knowledgeChunks } from "@/server/db/schema";
import { generateEmbedding } from "@/lib/embeddings";

export const knowledgeRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ consultantId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.knowledgeChunks.findMany({
        where: eq(knowledgeChunks.consultantId, input.consultantId),
        orderBy: (kc, { desc }) => [desc(kc.createdAt)],
        limit: 100,
      });
    }),

  add: protectedProcedure
    .input(
      z.object({
        consultantId: z.string().uuid(),
        content: z.string().min(1).max(10000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [created] = await ctx.db
        .insert(knowledgeChunks)
        .values({ consultantId: input.consultantId, content: input.content, source: "manual" })
        .returning();

      // Generate and store embedding — fire-and-forget so the UI responds immediately
      generateEmbedding(input.content).then(async (embedding) => {
        if (!embedding) return;
        try {
          const vectorLiteral = `[${embedding.join(",")}]`;
          await ctx.db.execute(sql`
            UPDATE knowledge_chunks
            SET embedding = ${vectorLiteral}::vector
            WHERE id = ${created.id}
          `);
        } catch (err) {
          console.error("[knowledge] Failed to store embedding:", err);
        }
      });

      return created;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(knowledgeChunks).where(eq(knowledgeChunks.id, input.id));
      return { success: true };
    }),
});
