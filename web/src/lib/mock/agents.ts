// Dữ liệu mẫu, hardcode tạm thời cho tới khi có mock API (docs/01-frontend.md §3.4)
// rồi API thật từ backend. Nội dung khớp dữ liệu mẫu trong docs/DATABASE.md §3
// và bảng agent trong IDEAS.md §1.4.
//
// `id` mới là khoá thật để liên kết dữ liệu (schedules, memories, rules đều
// tham chiếu tới `agentId`) — thực tế là UUID, ở đây dùng chuỗi ngắn `ag_*` cho
// dễ đọc, đúng quy ước DATABASE.md. `slug` CHỈ để đẹp URL (`/agents/mail-action`),
// không dùng để join dữ liệu.

import type { AgentModel, AgentSkillKey, AgentToolKey } from "@/lib/api/agents";

export type MockAgent = {
  id: string;
  slug: string;
  name: string;
  description: string;
  instructions: string;
  canDo: string[];
  cannotDo: string[];
  tools: AgentToolKey[];
  skills: AgentSkillKey[];
  model: AgentModel;
};

/** id của "Chat chung" — không nằm trong MOCK_AGENTS (không phải agent chuyên trách), nhưng vẫn có dữ liệu riêng (chi phí, hồ sơ chung). */
export const GENERAL_AGENT_ID = "ag_general";

export const MOCK_AGENTS: MockAgent[] = [
  {
    id: "ag_mail",
    slug: "mail-action",
    name: "mail-action",
    description: "Soạn và gửi mail, daily/weekly report, gửi theo lịch",
    instructions:
      "Bạn là trợ lý soạn và gửi mail. Viết daily/weekly report theo đúng rule, gửi mail theo lịch hoặc theo yêu cầu, quản lý danh bạ người nhận.",
    canDo: [
      "Viết mail daily/weekly report theo rule",
      "Gửi mail theo lịch cố định",
      "Soạn và gửi mail bất kỳ (to, cc, bcc)",
      "Quản lý người nhận (danh bạ)",
    ],
    cannotDo: ["Đọc hộp thư", "Xoá mail", "Việc ngoài email"],
    tools: ["send_email", "contacts", "schedule", "save_record"],
    skills: ["daily-report", "weekly-report"],
    model: "haiku",
  },
];

export function getMockAgent(slug: string): MockAgent | undefined {
  return MOCK_AGENTS.find((agent) => agent.slug === slug);
}

/** Tên hiển thị cho 1 agentId — dùng ở chỗ chỉ có id (ví dụ bảng chi phí theo agent). */
export function getMockAgentNameById(agentId: string): string {
  if (agentId === GENERAL_AGENT_ID) return "Chat chung";
  return MOCK_AGENTS.find((agent) => agent.id === agentId)?.name ?? agentId;
}
