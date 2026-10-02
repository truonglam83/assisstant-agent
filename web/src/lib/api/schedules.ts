import { ENDPOINTS } from "./endpoints";
import { callApi } from "./http";
import {
  getMockScheduleRunsForAgent,
  getMockSchedules,
  type MockSchedule,
  type MockScheduleRun,
} from "@/lib/mock/schedules";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const schedulesApi = {
  async list(agentId: string): Promise<MockSchedule[]> {
    const endpoint = ENDPOINTS.LIST_SCHEDULES
      ? ENDPOINTS.LIST_SCHEDULES.replace(":agentId", agentId)
      : "";
    return callApi(endpoint, { method: "GET" }, async () => {
      await delay(250);
      return getMockSchedules(agentId);
    });
  },

  async listRuns(agentId: string): Promise<MockScheduleRun[]> {
    const endpoint = ENDPOINTS.LIST_SCHEDULE_RUNS
      ? ENDPOINTS.LIST_SCHEDULE_RUNS.replace(":agentId", agentId)
      : "";
    return callApi(endpoint, { method: "GET" }, async () => {
      await delay(250);
      return getMockScheduleRunsForAgent(agentId);
    });
  },

  async toggle(id: string, enabled: boolean): Promise<void> {
    const endpoint = ENDPOINTS.TOGGLE_SCHEDULE ? `${ENDPOINTS.TOGGLE_SCHEDULE}/${id}` : "";
    return callApi(
      endpoint,
      { method: "PATCH", body: JSON.stringify({ enabled }) },
      async () => {
        console.log("[mock schedulesApi.toggle]", id, enabled);
        await delay(300);
      },
    );
  },
};
