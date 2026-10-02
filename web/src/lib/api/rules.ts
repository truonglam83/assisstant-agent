import { ENDPOINTS } from "./endpoints";
import { callApi } from "./http";
import { getMockRules, type MockRule } from "@/lib/mock/rules";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const rulesApi = {
  async list(agentId: string): Promise<MockRule[]> {
    const endpoint = ENDPOINTS.LIST_RULES
      ? ENDPOINTS.LIST_RULES.replace(":agentId", agentId)
      : "";
    return callApi(endpoint, { method: "GET" }, async () => {
      await delay(200);
      return getMockRules(agentId);
    });
  },
};
