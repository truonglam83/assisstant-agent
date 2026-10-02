"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
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

type AgentModalContextValue = {
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
 * Quản lý popup tạo/sửa/xoá agent, đặt ở gốc layout (app) để cả Sidebar
 * (nút "+ New agent") lẫn header trang agent (nút ⚙️) đều mở được popup.
 *
 * Lưu ý: chưa có state/store dùng chung (docs/01-frontend.md §4 "Cách quản lý
 * dữ liệu"), nên tạo/sửa/xoá xong chỉ đóng popup — danh sách agent ở Sidebar
 * chưa tự cập nhật. Sẽ nối lại khi có mock API hoặc backend thật.
 */
export function AgentModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ModalState>({ type: "closed" });
  const { toast } = useToast();

  const value: AgentModalContextValue = {
    openCreate: () => setState({ type: "create" }),
    openEdit: (agent) => setState({ type: "edit", agent }),
    openDelete: (agent) => setState({ type: "delete", agent }),
    close: () => setState({ type: "closed" }),
  };

  return (
    <AgentModalContext.Provider value={value}>
      {children}

      {state.type === "create" ? (
        <AgentFormModal mode="create" onClose={value.close} />
      ) : null}

      {state.type === "edit" ? (
        <AgentFormModal
          mode="edit"
          agent={state.agent}
          onClose={value.close}
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
            await agentsApi.remove(state.agent.slug);
            toast({ type: "success", message: `Đã xoá agent "${agentName}"` });
            value.close();
          }}
        />
      ) : null}
    </AgentModalContext.Provider>
  );
}
