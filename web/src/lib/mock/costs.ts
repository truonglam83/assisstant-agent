// Dữ liệu mẫu — chi phí token/model theo IDEAS.md §5.5. Liên kết bằng `agentId`.

import { GENERAL_AGENT_ID } from "@/lib/mock/agents";

export type MockCostByAgent = {
  agentId: string;
  todayUsd: number;
  monthUsd: number;
};

const MOCK_COST_BY_AGENT: MockCostByAgent[] = [
  { agentId: "ag_mail", todayUsd: 0.005, monthUsd: 0.31 },
  { agentId: GENERAL_AGENT_ID, todayUsd: 0, monthUsd: 0.11 },
];

export function getMockTotalCost() {
  return {
    todayUsd: MOCK_COST_BY_AGENT.reduce((sum, row) => sum + row.todayUsd, 0),
    monthUsd: MOCK_COST_BY_AGENT.reduce((sum, row) => sum + row.monthUsd, 0),
  };
}

export function getMockCostByAgent(): MockCostByAgent[] {
  return MOCK_COST_BY_AGENT;
}

export function getMockCostForAgent(agentId: string): MockCostByAgent {
  return (
    MOCK_COST_BY_AGENT.find((row) => row.agentId === agentId) ?? {
      agentId,
      todayUsd: 0,
      monthUsd: 0,
    }
  );
}
