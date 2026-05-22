"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";

export function KnowledgeBasePanel({ consultantId }: { consultantId: string }) {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  const add = trpc.knowledge.add.useMutation({
    onSuccess: () => {
      setText("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const { data: chunks, refetch } = trpc.knowledge.list.useQuery({ consultantId });

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    add.mutate({ consultantId, content: text.trim() });
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
      <p className="text-xs text-muted-foreground">
        Add anything your AI should know — your background, FAQs, methodologies, processes.
      </p>

      <form onSubmit={handleAdd} className="space-y-2">
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. I specialise in helping early-stage founders build GTM strategy. My process starts with a 3-step discovery framework..."
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          disabled={add.isPending || !text.trim()}
          className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
        >
          {saved ? "Added!" : add.isPending ? "Adding..." : "+ Add to knowledge base"}
        </button>
      </form>

      {chunks && chunks.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {chunks.map((chunk) => (
            <div key={chunk.id} className="rounded-md bg-muted px-3 py-2">
              <p className="text-xs text-foreground line-clamp-3">{chunk.content}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(chunk.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
