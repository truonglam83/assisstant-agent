// "Constant API" cho popup tạo/sửa/xoá agent (docs/01-frontend.md).
//
// CHƯA CÓ BACKEND: endpoint trong endpoints.ts đang để trống, nên mỗi hàm
// dưới đây tự log ra console + giả lập độ trễ mạng thay vì gọi thật. Khi có
// backend (theo contract ở docs/02-backend-api.md), chỉ cần điền endpoint
// trong endpoints.ts — nơi gọi (popup) không cần đổi gì.

export type AgentToolKey =
  | "save_record"
  | "schedule"
  | "send_email"
  | "contacts"
  | "web_search";

export const AGENT_TOOL_OPTIONS: { key: AgentToolKey; label: string }[] = [
  { key: "save_record", label: "Lưu dữ liệu" },
  { key: "schedule", label: "Lịch chạy" },
  { key: "send_email", label: "Gửi mail" },
  { key: "contacts", label: "Danh bạ" },
  { key: "web_search", label: "Tìm kiếm web" },
];

export type AgentSkillKey = "daily-report" | "weekly-report";

export const AGENT_SKILL_OPTIONS: { key: AgentSkillKey; label: string }[] = [
  { key: "daily-report", label: "daily-report" },
  { key: "weekly-report", label: "weekly-report" },
];

export type AgentModel = "haiku" | "sonnet";

export type AgentFormInput = {
  name: string;
  description: string;
  instructions: string;
  canDo: string;
  cannotDo: string;
  tools: AgentToolKey[];
  skills: AgentSkillKey[];
  model: AgentModel;
};

import { ENDPOINTS } from "./endpoints";
import { callApi } from "./http";
import { getMockAgent, MOCK_AGENTS, type MockAgent } from "@/lib/mock/agents";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

export const agentsApi = {
  /** Danh sách agent — cho Sidebar. */
  async list(): Promise<MockAgent[]> {
    return callApi(ENDPOINTS.LIST_AGENTS, { method: "GET" }, async () => {
      await delay(150);
      return MOCK_AGENTS;
    });
  },

  /** BE tự tra theo slug (Cách A) — trả về đúng 1 agent, kèm `id` thật để các API khác dùng. */
  async getBySlug(slug: string): Promise<MockAgent | undefined> {
    const endpoint = ENDPOINTS.GET_AGENT_BY_SLUG
      ? ENDPOINTS.GET_AGENT_BY_SLUG.replace(":slug", slug)
      : "";
    return callApi(endpoint, { method: "GET" }, async () => {
      await delay(150);
      return getMockAgent(slug);
    });
  },

  async create(input: AgentFormInput): Promise<{ slug: string }> {
    return callApi(
      ENDPOINTS.CREATE_AGENT,
      { method: "POST", body: JSON.stringify(input) },
      async () => {
        console.log("[mock agentsApi.create]", input);
        await delay(400);
        return { slug: slugify(input.name) };
      },
    );
  },

  async update(slug: string, input: AgentFormInput): Promise<void> {
    const endpoint = ENDPOINTS.UPDATE_AGENT ? `${ENDPOINTS.UPDATE_AGENT}/${slug}` : "";
    return callApi(
      endpoint,
      { method: "PATCH", body: JSON.stringify(input) },
      async () => {
        console.log("[mock agentsApi.update]", slug, input);
        await delay(400);
      },
    );
  },

  async remove(slug: string): Promise<void> {
    const endpoint = ENDPOINTS.DELETE_AGENT ? `${ENDPOINTS.DELETE_AGENT}/${slug}` : "";
    return callApi(endpoint, { method: "DELETE" }, async () => {
      console.log("[mock agentsApi.remove]", slug);
      await delay(400);
    });
  },
};
