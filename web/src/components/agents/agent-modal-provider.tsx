"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import type { MockAgent } from "@/lib/mock/agents";
import { agentsApi } from "@/lib/api/agents";
import { AgentFormModal } from "@/components/agents/agent-form-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast-provider";

type ModalState =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; agent: MockAgent }
  | { type: "delete"; agent: MockAgent };

export type AgentModalContextValue = {
  agents: MockAgent[];
  isLoaded: boolean;
  refreshAgents: () => Promise<void>;
  openCreate: () => void;
  openEdit: (agent: MockAgent) => void;
  openDelete: (agent: MockAgent) => void;
  close: () => void;
};

const AgentModalContext = createContext<AgentModalContextValue | null>(null);

export function useAgentModal(): AgentModalContextValue {
  const ctx = useContext(AgentModalContext);
  if (!ctx) {
    throw new Error("useAgentModal phải được gọi bên trong <AgentModalProvider>");
  }
  return ctx;
}

/**
 * Quản lý popup tạo/sửa/xoá agent và đồng bộ danh sách agent ở Sidebar.
 * Đặt ở gốc layout (app) để Sidebar và mọi trang đều dùng chung.
 */
export function AgentModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ModalState>({ type: "closed" });
  const [agents, setAgents] = useState<MockAgent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const refreshAgents = useCallback(async () => {
    try {
      const list = await agentsApi.list();
      setAgents([...list]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    refreshAgents();
  }, [refreshAgents]);

  const value: AgentModalContextValue = {
    agents,
    isLoaded,
    refreshAgents,
    openCreate: () => setState({ type: "create" }),
    openEdit: (agent) => setState({ type: "edit", agent }),
    openDelete: (agent) => setState({ type: "delete", agent }),
    close: () => setState({ type: "closed" }),
  };

  return (
    <AgentModalContext.Provider value={value}>
      {children}

      {state.type === "create" ? (
        <AgentFormModal
          mode="create"
          onClose={value.close}
          onSuccess={async (newSlug) => {
            await refreshAgents();
            value.close();
            if (newSlug) {
              router.push(`/agents/${newSlug}/rules`);
            }
          }}
        />
      ) : null}

      {state.type === "edit" ? (
        <AgentFormModal
          mode="edit"
          agent={state.agent}
          onClose={value.close}
          onSuccess={async () => {
            await refreshAgents();
            router.refresh();
            value.close();
          }}
          onRequestDelete={() => value.openDelete(state.agent)}
        />
      ) : null}

      {state.type === "delete" ? (
        <ConfirmDialog
          title={`Xoá agent "${state.agent.name}"?`}
          description="Không thể hoàn tác. Toàn bộ chat, rule, lịch của agent này sẽ mất."
          confirmLabel="Xoá"
          danger
          onCancel={() => value.openEdit(state.agent)}
          onConfirm={async () => {
            const agentName = state.agent.name;
            const deletedSlug = state.agent.slug;
            await agentsApi.remove(deletedSlug);
            await refreshAgents();
            toast({ type: "success", message: `Đã xoá agent "${agentName}"` });
            value.close();
            if (pathname.includes(`/agents/${deletedSlug}`)) {
              router.push("/");
            }
          }}
        />
      ) : null}
    </AgentModalContext.Provider>
  );
}
