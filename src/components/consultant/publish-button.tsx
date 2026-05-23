"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { GoLiveModal } from "./go-live-modal";

interface PublishButtonProps {
  isPublished: boolean;
  slug: string;
  name: string;
  headline?: string | null;
}

export function PublishButton({ isPublished, slug, name, headline }: PublishButtonProps) {
  const router = useRouter();
  const [live, setLive] = useState(isPublished);
  const [showModal, setShowModal] = useState(false);

  const publish = trpc.consultants.publish.useMutation({
    onSuccess: () => {
      setShowModal(true);
    },
  });

  function handleModalClose() {
    setShowModal(false);
    setLive(true);
    router.refresh();
  }

  if (live) {
    return (
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-sm font-medium text-green-700">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Live at inpro.ai/{slug}
        </span>
        <a
          href={`/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-[#204ecf] hover:underline"
        >
          View profile →
        </a>
      </div>
    );
  }

  return (
    <>
      {showModal && (
        <GoLiveModal
          slug={slug}
          name={name}
          headline={headline}
          onClose={handleModalClose}
        />
      )}
      <button
        onClick={() => publish.mutate()}
        disabled={publish.isPending}
        className="flex items-center gap-2 rounded-lg bg-[#204ecf] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1a3fb5] transition-colors disabled:opacity-50 shadow-sm"
      >
        {publish.isPending ? (
          <>
            <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Going live...
          </>
        ) : (
          <>
            <span className="h-2 w-2 rounded-full bg-white" />
            Go live
          </>
        )}
      </button>
    </>
  );
}
