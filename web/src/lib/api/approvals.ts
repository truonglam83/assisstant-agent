import { ENDPOINTS } from "./endpoints";
import { callApi } from "./http";
import { getMockPendingApprovals, type MockApproval } from "@/lib/mock/schedules";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type ApprovalDecision = "approved" | "rejected";

export const approvalsApi = {
  async listPending(agentId: string): Promise<MockApproval[]> {
    const endpoint = ENDPOINTS.LIST_PENDING_APPROVALS
      ? ENDPOINTS.LIST_PENDING_APPROVALS.replace(":agentId", agentId)
      : "";
    return callApi(endpoint, { method: "GET" }, async () => {
      await delay(250);
      return getMockPendingApprovals(agentId);
    });
  },

  async decide(id: string, decision: ApprovalDecision): Promise<void> {
    const endpoint = ENDPOINTS.DECIDE_APPROVAL ? `${ENDPOINTS.DECIDE_APPROVAL}/${id}/decide` : "";
    return callApi(
      endpoint,
      { method: "POST", body: JSON.stringify({ decision }) },
      async () => {
        console.info("[mock approvalsApi.decide]", id, decision);
        await delay(300);
      },
    );
  },
};
