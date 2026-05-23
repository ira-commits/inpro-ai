import { openai } from "@ai-sdk/openai";
import { embed } from "ai";

/**
 * Generate a 1536-dim embedding for the given text using OpenAI text-embedding-3-small.
 * Returns null if OPENAI_API_KEY is not configured — callers should handle gracefully.
 */
export async function generateEmbedding(text: string): Promise<number[] | null> {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  try {
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: text,
    });
    return embedding;
  } catch (err) {
    console.error("[embeddings] Failed to generate embedding:", err);
    return null;
  }
}
