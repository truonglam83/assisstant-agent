import { ENDPOINTS } from "./endpoints";
import { callApi } from "./http";
import { getMockRules, type MockRule } from "@/lib/mock/rules";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface CreateRuleInput {
  scope?: string;
  title: string;
  content: string;
  enabled?: boolean;
}

export interface UpdateRuleInput {
  scope?: string;
  title?: string;
  content?: string;
  enabled?: boolean;
  changeReason?: string;
}

export interface RuleVersion {
  id: string;
  ruleId: string;
  version: number;
  content: string;
  changeReason?: string;
  createdAt: string;
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

  async create(agentId: string, input: CreateRuleInput): Promise<MockRule> {
    const endpoint = ENDPOINTS.CREATE_RULE
      ? ENDPOINTS.CREATE_RULE.replace(":agentId", agentId)
      : "";
    return callApi(
      endpoint,
      { method: "POST", body: JSON.stringify(input) },
      async () => {
        await delay(200);
        return {
          id: `ru_${Date.now()}`,
          scope: input.scope || "all",
          title: input.title,
          content: input.content,
          enabled: input.enabled ?? true,
        };
      },
    );
  },

  async update(ruleId: string, input: UpdateRuleInput): Promise<MockRule> {
    const endpoint = ENDPOINTS.UPDATE_RULE
      ? `${ENDPOINTS.UPDATE_RULE}/${ruleId}`
      : "";
    return callApi(
      endpoint,
      { method: "PATCH", body: JSON.stringify(input) },
      async () => {
        await delay(200);
        return {
          id: ruleId,
          scope: input.scope || "all",
          title: input.title || "",
          content: input.content || "",
          enabled: input.enabled ?? true,
        };
      },
    );
  },

  async remove(ruleId: string): Promise<void> {
    const endpoint = ENDPOINTS.DELETE_RULE
      ? `${ENDPOINTS.DELETE_RULE}/${ruleId}`
      : "";
    return callApi(endpoint, { method: "DELETE" }, async () => {
      await delay(200);
    });
  },

  async getVersions(ruleId: string): Promise<RuleVersion[]> {
    const endpoint = ENDPOINTS.GET_RULE_VERSIONS
      ? ENDPOINTS.GET_RULE_VERSIONS.replace(":id", ruleId)
      : "";
    return callApi(endpoint, { method: "GET" }, async () => {
      await delay(200);
      return [];
    });
  },
};
