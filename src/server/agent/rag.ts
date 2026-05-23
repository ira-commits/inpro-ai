import { db } from "@/server/db";
import { knowledgeChunks } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { generateEmbedding } from "@/lib/embeddings";

/**
 * Retrieve the most relevant knowledge chunks for a given query using
 * pgvector cosine similarity search (text-embedding-3-small, 1536 dims).
 *
 * Falls back to returning the most recent chunks when:
 * - OPENAI_API_KEY is not configured
 * - Embedding generation fails
 * - No embeddings have been indexed yet
 */
export async function getRelevantContext(
  consultantId: string,
  query: string,
  topK = 5
): Promise<string> {
  // Try vector search first
  const queryEmbedding = await generateEmbedding(query);

  if (queryEmbedding) {
    try {
      // pgvector cosine similarity: <=> operator (lower = more similar)
      // Cast the JS array to Postgres vector literal
      const vectorLiteral = `[${queryEmbedding.join(",")}]`;

      const rows = await db.execute(sql`
        SELECT content
        FROM knowledge_chunks
        WHERE consultant_id = ${consultantId}
          AND embedding IS NOT NULL
        ORDER BY embedding <=> ${vectorLiteral}::vector
        LIMIT ${topK}
      `);

      // rows is an array of row objects; column name is lowercase
      const contents = (rows as unknown as { content: string }[])
        .map((r) => r.content)
        .filter(Boolean);

      if (contents.length > 0) {
        return contents.join("\n\n---\n\n");
      }
    } catch (err) {
      console.error("[rag] pgvector search failed, falling back:", err);
    }
  }

  // Fallback: return the most recent chunks (no semantic relevance, but better than nothing)
  const chunks = await db
    .select({ content: knowledgeChunks.content })
    .from(knowledgeChunks)
    .where(eq(knowledgeChunks.consultantId, consultantId))
    .limit(topK);

  if (chunks.length === 0) return "";
  return chunks.map((c) => c.content).join("\n\n---\n\n");
}
