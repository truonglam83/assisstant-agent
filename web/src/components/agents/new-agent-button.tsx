"use client";

import { useAgentModal } from "@/components/agents/agent-modal-provider";

export function NewAgentButton() {
  const { openCreate } = useAgentModal();

  return (
    <button
      type="button"
      onClick={openCreate}
      className="mt-1 flex items-center gap-2.5 rounded-[10px] border border-dashed border-accent/60 px-3 py-2.5 text-[15px] font-medium text-accent"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
      New agent
    </button>
  );
}
