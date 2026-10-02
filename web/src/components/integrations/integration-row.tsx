"use client";

import { useState } from "react";
import type { MockIntegration } from "@/lib/mock/integrations";
import { integrationsApi } from "@/lib/api/integrations";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function IntegrationRow({ integration }: { integration: MockIntegration }) {
  const [connected, setConnected] = useState(integration.connected);
  const [confirmingDisconnect, setConfirmingDisconnect] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-white p-4">
      <div className="flex flex-col gap-1">
        <div className="text-sm font-semibold text-text">{integration.label}</div>
        {connected ? (
          <div className="text-xs text-text-muted">
            Đã kết nối · {integration.accountEmail} · quyền: {integration.scopes.join(", ")}
          </div>
        ) : (
          <div className="text-xs text-text-muted">Chưa kết nối</div>
        )}
      </div>

      {connected ? (
        <button
          type="button"
          onClick={() => setConfirmingDisconnect(true)}
          className="h-10 rounded-lg border border-border-input px-4 text-sm font-medium text-text"
        >
          Ngắt kết nối
        </button>
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            setPending(true);
            integrationsApi.connect();
          }}
          className="h-10 rounded-lg bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
        >
          Kết nối
        </button>
      )}

      {confirmingDisconnect ? (
        <ConfirmDialog
          title={`Ngắt kết nối ${integration.label}?`}
          description="Các lịch/agent đang dùng dịch vụ này sẽ ngừng hoạt động cho tới khi kết nối lại."
          confirmLabel="Ngắt kết nối"
          danger
          onCancel={() => setConfirmingDisconnect(false)}
          onConfirm={async () => {
            await integrationsApi.disconnect();
            setConnected(false);
            setConfirmingDisconnect(false);
          }}
        />
      ) : null}
    </div>
  );
}
