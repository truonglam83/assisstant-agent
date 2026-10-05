import { ENDPOINTS } from "./endpoints";
import { callApi } from "./http";
import {
  getMockMemoriesForAgent,
  getMockSharedMemories,
  type MockMemory,
} from "@/lib/mock/memories";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type MemoryPatch = { pinned?: boolean; content?: string };

export const memoriesApi = {
  /** Ghi nhớ riêng của 1 agent. */
  async list(agentId: string): Promise<MockMemory[]> {
    const endpoint = ENDPOINTS.LIST_MEMORIES
      ? ENDPOINTS.LIST_MEMORIES.replace(":agentId", agentId)
      : "";
    return callApi(endpoint, { method: "GET" }, async () => {
      await delay(250);
      return getMockMemoriesForAgent(agentId);
    });
  },

  /** Hồ sơ chung — không thuộc agent nào, mọi agent + Chat chung đều đọc. */
  async listShared(): Promise<MockMemory[]> {
    return callApi(ENDPOINTS.LIST_SHARED_MEMORIES, { method: "GET" }, async () => {
      await delay(250);
      return getMockSharedMemories();
    });
  },

  async update(id: string, patch: MemoryPatch): Promise<void> {
    const endpoint = ENDPOINTS.UPDATE_MEMORY ? `${ENDPOINTS.UPDATE_MEMORY}/${id}` : "";
    return callApi(
      endpoint,
      { method: "PATCH", body: JSON.stringify(patch) },
      async () => {
        console.info("[mock memoriesApi.update]", id, patch);
        await delay(250);
      },
    );
  },

  async remove(id: string): Promise<void> {
    const endpoint = ENDPOINTS.DELETE_MEMORY ? `${ENDPOINTS.DELETE_MEMORY}/${id}` : "";
    return callApi(endpoint, { method: "DELETE" }, async () => {
      console.info("[mock memoriesApi.remove]", id);
      await delay(250);
    });
  },
};
