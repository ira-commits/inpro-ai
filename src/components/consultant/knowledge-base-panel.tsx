"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";

const STARTER_PROMPTS = [
  "My background and expertise",
  "How I work with clients",
  "My pricing philosophy",
  "Common questions I get asked",
  "What makes me different",
  "My process and methodology",
];

export function KnowledgeBasePanel({ consultantId }: { consultantId: string }) {
  const [text, setText] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  const { data: chunks, refetch } = trpc.knowledge.list.useQuery({ consultantId });

  const add = trpc.knowledge.add.useMutation({
    onSuccess: () => {
      setText("");
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
      refetch();
    },
  });

  const remove = trpc.knowledge.delete.useMutation({
    onSuccess: () => refetch(),
  });

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    add.mutate({ consultantId, content: text.trim() });
  }

  const charCount = text.length;
  const charMax = 2000;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-5">
      {/* Header */}
      <div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Everything you add here gets used by your AI when answering client questions.
          Be specific — the more context, the better your AI performs.
        </p>
      </div>

      {/* Starter prompts */}
      {(!chunks || chunks.length === 0) && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Not sure where to start?
          </p>
          <div className="flex flex-wrap gap-2">
            {STARTER_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setText((prev) => prev ? `${prev}\n\n${prompt}: ` : `${prompt}: `)}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 hover:border-[#204ecf] hover:text-[#204ecf] transition-colors"
              >
                + {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add form */}
      <form onSubmit={handleAdd} className="space-y-2">
        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, charMax))}
          placeholder="e.g. I specialize in helping early-stage founders build GTM strategy. My process starts with a 3-step discovery framework: understand the market, validate the ICP, then build the outbound engine..."
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#204ecf] placeholder:text-gray-400"
        />
        <div className="flex items-center justify-between">
          <span className={`text-xs ${charCount > charMax * 0.9 ? "text-yellow-600" : "text-gray-400"}`}>
            {charCount}/{charMax}
          </span>
          <button
            type="submit"
            disabled={add.isPending || !text.trim()}
            className="rounded-lg bg-[#204ecf] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1a3fb5] transition-colors disabled:opacity-50"
          >
            {justAdded ? "Added!" : add.isPending ? "Adding..." : "Add to knowledge base"}
          </button>
        </div>
      </form>

      {/* Existing chunks */}
      {chunks && chunks.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {chunks.length} entr{chunks.length === 1 ? "y" : "ies"} in knowledge base
          </p>
          <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
            {chunks.map((chunk) => (
              <KnowledgeChunk
                key={chunk.id}
                id={chunk.id}
                content={chunk.content}
                createdAt={chunk.createdAt}
                onDelete={() => remove.mutate({ id: chunk.id })}
                isDeleting={remove.isPending}
              />
            ))}
          </div>
        </div>
      )}

      {chunks && chunks.length === 0 && !text && (
        <div className="rounded-lg border border-dashed border-gray-200 py-6 text-center">
          <p className="text-sm text-gray-400">No knowledge added yet</p>
          <p className="text-xs text-gray-400 mt-1">Your AI will only use what you add here</p>
        </div>
      )}
    </div>
  );
}

function KnowledgeChunk({
  id,
  content,
  createdAt,
  onDelete,
  isDeleting,
}: {
  id: string;
  content: string;
  createdAt: Date;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = content.length > 200;

  return (
    <div className="group rounded-lg border border-gray-100 bg-[#f7f9fc] px-3 py-3">
      <p className="text-xs text-[#1a2744] leading-relaxed">
        {isLong && !expanded ? `${content.slice(0, 200)}...` : content}
      </p>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            {new Date(createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
          {isLong && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-xs text-[#204ecf] hover:underline"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-30"
          aria-label="Delete"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
