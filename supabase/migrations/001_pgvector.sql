-- Enable pgvector extension
create extension if not exists vector;

-- Add embedding column to knowledge_chunks (1536 dims = text-embedding-3-small)
alter table knowledge_chunks
  add column if not exists embedding vector(1536);

-- HNSW index for fast cosine similarity search
create index if not exists knowledge_chunks_embedding_idx
  on knowledge_chunks
  using hnsw (embedding vector_cosine_ops);
