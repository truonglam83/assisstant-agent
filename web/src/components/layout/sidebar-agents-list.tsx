"use client";

import { useAgentModal } from "@/components/agents/agent-modal-provider";
import { NavLink } from "@/components/ui/nav-link";
import { NewAgentButton } from "@/components/agents/new-agent-button";
import type { MockAgent } from "@/lib/mock/agents";

const navActive = "border border-border bg-white font-semibold text-text";
const navInactive = "border border-transparent font-normal text-text";

export function SidebarAgentsList({ initialAgents }: { initialAgents: MockAgent[] }) {
  const { agents, isLoaded } = useAgentModal();
  // Dùng initialAgents chỉ khi chưa mount/hydrate xong để tránh layout shift.
  // Khi isLoaded = true, danh sách agents (dù rỗng) là nguồn chân lý chính xác nhất.
  const list = isLoaded ? agents : initialAgents;

  return (
    <>
      <div className="px-3 pb-1.5 pt-5 text-xs font-semibold tracking-wide text-text-muted">
        AGENTS
      </div>

      {list.length === 0 ? (
        <div className="px-3 py-2 text-sm text-text-muted">Chưa có agent nào</div>
      ) : (
        list.map((agent) => (
          <NavLink
            key={agent.id}
            href={`/agents/${agent.slug}`}
            className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[15px]"
            activeClassName={navActive}
            inactiveClassName={navInactive}
          >
            <svg
              width="18"
              height="18"
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
            <span className="flex-1 truncate">{agent.name}</span>
          </NavLink>
        ))
      )}

      <NewAgentButton />
    </>
  );
}
