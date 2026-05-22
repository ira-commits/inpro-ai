import { db } from "@/server/db";
import { knowledgeChunks } from "@/server/db/schema";
import { eq } from "drizzle-orm";

/**
 * Retrieve relevant knowledge chunks for a given query.
 *
 * Currently returns the most recent manual chunks as a simple fallback.
 * TODO: Replace with pgvector cosine similarity search once OpenAI
 * embeddings are wired up (text-embedding-3-small → pgvector).
 */
export async function getRelevantContext(
  consultantId: string,
  _query: string,
  topK = 5
): Promise<string> {
  const chunks = await db
    .select({ content: knowledgeChunks.content })
    .from(knowledgeChunks)
    .where(eq(knowledgeChunks.consultantId, consultantId))
    .limit(topK);

  if (chunks.length === 0) return "";

  return chunks.map((c) => c.content).join("\n\n---\n\n");
}
