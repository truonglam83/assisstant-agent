"use client";

import Link from "next/link";
import { useAgentModal } from "@/components/agents/agent-modal-provider";
import { getMockAgent } from "@/lib/mock/agents";

export function AgentSuggestionCard({ slug }: { slug: string }) {
  const { agents } = useAgentModal();
  const agent = agents.find((a) => a.slug === slug) ?? getMockAgent(slug);

  if (!agent) return null;

  return (
    <div className="mt-2.5 flex items-center justify-between gap-3.5 rounded-[14px] border border-border bg-white p-3.5 shadow-xs transition-shadow hover:shadow-sm sm:px-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-accent-soft text-accent">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="truncate text-[15px] font-semibold text-text">{agent.name}</div>
          <div className="truncate text-[13px] text-text-muted">
            {agent.description || "Agent chuyên trách"}
          </div>
        </div>
      </div>

      <Link
        href={`/agents/${agent.slug}`}
        className="shrink-0 rounded-[10px] bg-accent px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
      >
        Mở agent
      </Link>
    </div>
  );
}
