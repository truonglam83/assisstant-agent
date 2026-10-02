import { ENDPOINTS } from "./endpoints";
import { callApi } from "./http";
import {
  getMockCostByAgent,
  getMockCostForAgent,
  getMockTotalCost,
  type MockCostByAgent,
} from "@/lib/mock/costs";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const costsApi = {
  /** Tổng chi phí mọi agent + bảng chia theo agent — dùng cho trang global /costs. */
  async getTotal(): Promise<{ todayUsd: number; monthUsd: number; byAgent: MockCostByAgent[] }> {
    return callApi(ENDPOINTS.GET_TOTAL_COST, { method: "GET" }, async () => {
      await delay(200);
      return { ...getMockTotalCost(), byAgent: getMockCostByAgent() };
    });
  },

  /** Chi phí CHỈ của 1 agent — dùng cho tab Lịch của agent đó. */
  async getForAgent(agentId: string): Promise<MockCostByAgent> {
    const endpoint = ENDPOINTS.GET_AGENT_COST
      ? ENDPOINTS.GET_AGENT_COST.replace(":agentId", agentId)
      : "";
    return callApi(endpoint, { method: "GET" }, async () => {
      await delay(200);
      return getMockCostForAgent(agentId);
    });
  },
};
