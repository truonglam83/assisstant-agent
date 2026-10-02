"use client";

import { useState } from "react";
import type { MockApproval } from "@/lib/mock/schedules";
import { approvalsApi } from "@/lib/api/approvals";

export function ApprovalCard({ approval }: { approval: MockApproval }) {
  const [decision, setDecision] = useState<"pending" | "approved" | "rejected">("pending");
  const [pending, setPending] = useState(false);

  async function decide(next: "approved" | "rejected") {
    setPending(true);
    await approvalsApi.decide(approval.id, next);
    setDecision(next);
    setPending(false);
  }

  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-border bg-white p-4">
      <div className="flex flex-col gap-1">
        <div className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          {approval.toolName}
        </div>
        <p className="text-sm leading-relaxed text-text">{approval.summary}</p>
        <p className="text-xs text-text-muted">{approval.createdAt}</p>
      </div>

      {decision === "pending" ? (
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => decide("rejected")}
            className="h-9 rounded-lg border border-border-input px-3 text-sm font-medium text-text disabled:opacity-60"
          >
            Từ chối
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => decide("approved")}
            className="h-9 rounded-lg bg-accent px-3 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
          >
            Duyệt
          </button>
        </div>
      ) : (
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
            decision === "approved"
              ? "bg-success-bg text-success-text"
              : "bg-danger-bg text-danger-text"
          }`}
        >
          {decision === "approved" ? "Đã duyệt" : "Đã từ chối"}
        </span>
      )}
    </div>
  );
}
