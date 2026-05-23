"use client";

import { useRouter, usePathname } from "next/navigation";
import { AgentConfigForm } from "@/components/consultant/agent-config-form";
import { KnowledgeBasePanel } from "@/components/consultant/knowledge-base-panel";
import { ResumeTrainingForm } from "@/components/consultant/resume-training-form";
import type { Agent } from "@/server/db/schema";

const TABS = [
  { id: "resume", label: "Resume & Training", description: "Initial AI training" },
  { id: "settings", label: "Agent Settings", description: "Name, persona, greeting" },
  { id: "knowledge", label: "Knowledge Base", description: "Add more context" },
];

interface Props {
  activeTab: string;
  agent: Agent | null | undefined;
  consultantId: string;
  chunkCount: number;
}

export function AgentTabs({ activeTab, agent, consultantId, chunkCount }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  function goTo(tab: string) {
    router.push(`${pathname}?tab=${tab}`);
  }

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-gray-200 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => goTo(tab.id)}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? "border-[#0A66C2] text-[#0A66C2]"
                : "border-transparent text-gray-500 hover:text-[#191919] hover:border-gray-300"
            }`}
          >
            {tab.label}
            {tab.id === "knowledge" && chunkCount > 0 && (
              <span className="ml-2 rounded-full bg-[#EEF3FB] px-2 py-0.5 text-xs font-bold text-[#0A66C2]">
                {chunkCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "resume" && (
        <div>
          <div className="mb-6 rounded-xl border border-[#0A66C2]/20 bg-[#EEF3FB] px-5 py-4 flex gap-3 items-start">
            <div className="text-xl mt-0.5">🎓</div>
            <div>
              <p className="text-sm font-bold text-[#191919]">Train your AI with your background</p>
              <p className="text-xs text-[#666666] mt-1">
                Fill out your professional profile below. Every field you complete becomes training data — your AI will use this to answer client questions, qualify leads, and represent your expertise accurately.
              </p>
            </div>
          </div>
          <ResumeTrainingForm consultantId={consultantId} />
        </div>
      )}

      {activeTab === "settings" && (
        <div className="max-w-xl">
          <AgentConfigForm agent={agent} />
        </div>
      )}

      {activeTab === "knowledge" && (
        <div>
          <div className="mb-6">
            <p className="text-sm text-gray-500">
              Add additional context, FAQs, or specific knowledge your AI should know beyond your resume. Each entry is embedded and retrieved semantically.
            </p>
          </div>
          <KnowledgeBasePanel consultantId={consultantId} />
        </div>
      )}
    </div>
  );
}
