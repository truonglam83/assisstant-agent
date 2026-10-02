// Dữ liệu mẫu — xem docs/DATABASE.md §3 (agent_rules của mail-action).
// Key theo agentId (không phải slug) — xem lib/mock/agents.ts.

export type MockRule = {
  id: string;
  scope: string; // "all" hoặc tên việc cụ thể, ví dụ "daily-report"
  title: string;
  content: string;
  enabled: boolean;
};

export const MOCK_RULE_SCOPES = ["all", "daily-report", "weekly-report"] as const;

export const MOCK_SCOPE_LABEL: Record<string, string> = {
  all: "Chung",
};

const MOCK_RULES_BY_AGENT_ID: Record<string, MockRule[]> = {
  ag_mail: [
    {
      id: "ru_01",
      scope: "all",
      title: "Chữ ký",
      content: "Best regards, Tuấn – Backend Developer – 0901 234 567",
      enabled: true,
    },
    {
      id: "ru_02",
      scope: "all",
      title: "Văn phong",
      content: "Ngắn gọn, lịch sự, xưng em. Không mở đầu dài dòng.",
      enabled: true,
    },
    {
      id: "ru_03",
      scope: "daily-report",
      title: "Format daily",
      content:
        'Tiêu đề "[Daily Report] dd/mm/yyyy". Mở đầu "Dear anh/chị,". Nội dung 3 mục: Đã làm, Todo, Vướng mắc (không có thì ghi "Không").',
      enabled: true,
    },
    {
      id: "ru_04",
      scope: "weekly-report",
      title: "Format weekly",
      content:
        'Tiêu đề "[Weekly Report] Tuần N (dd/mm – dd/mm)". Nội dung 3 mục: Kết quả tuần này, Kế hoạch tuần sau, Vấn đề cần hỗ trợ.',
      enabled: true,
    },
  ],
};

export function getMockRules(agentId: string): MockRule[] {
  return MOCK_RULES_BY_AGENT_ID[agentId] ?? [];
}
