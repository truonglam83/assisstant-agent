// Dữ liệu mẫu — xem docs/DATABASE.md §3 (`schedules`, `schedule_runs`, `approvals`).
// Không có mockup ảnh cho trang này — tự thiết kế. Liên kết bằng `agentId`
// (xem lib/mock/agents.ts), không phải `slug`.

export type ScheduleMode = "auto_send" | "draft_for_approval";

export type MockSchedule = {
  id: string;
  name: string;
  agentId: string;
  taskType: string;
  cronLabel: string; // đã format sẵn để hiện, ví dụ "7h, thứ 2–6"
  mode: ScheduleMode;
  enabled: boolean;
  lastRunAt?: string;
};

const MOCK_SCHEDULES: MockSchedule[] = [
  {
    id: "sc_daily",
    name: "Daily report",
    agentId: "ag_mail",
    taskType: "daily-report",
    cronLabel: "7h00, thứ 2 – thứ 6",
    mode: "auto_send",
    enabled: true,
    lastRunAt: "02/10/2026 07:00",
  },
  {
    id: "sc_weekly",
    name: "Weekly report",
    agentId: "ag_mail",
    taskType: "weekly-report",
    cronLabel: "7h00, thứ 6",
    mode: "auto_send",
    enabled: true,
    lastRunAt: "02/10/2026 07:00",
  },
];

export type ScheduleRunStatus = "sent" | "skipped_no_input" | "failed";

export type MockScheduleRun = {
  id: string;
  scheduleId: string;
  runDate: string;
  status: ScheduleRunStatus;
  summary: string;
};

const MOCK_SCHEDULE_RUNS: MockScheduleRun[] = [
  {
    id: "sr_01",
    scheduleId: "sc_daily",
    runDate: "01/10/2026",
    status: "sent",
    summary: "[Daily Report] 01/10/2026 · To: minh@company.com",
  },
  {
    id: "sr_02",
    scheduleId: "sc_daily",
    runDate: "02/10/2026",
    status: "sent",
    summary: "[Daily Report] 02/10/2026 · To: minh@company.com",
  },
  {
    id: "sr_03",
    scheduleId: "sc_weekly",
    runDate: "02/10/2026",
    status: "sent",
    summary: "[Weekly Report] Tuần 40 · To: minh@company.com",
  },
];

export type MockApproval = {
  id: string;
  agentId: string;
  toolName: string;
  summary: string;
  createdAt: string;
};

// TODO: thay bằng mock API / API thật — chỉ hiện những approval đang `pending`.
const MOCK_PENDING_APPROVALS: MockApproval[] = [
  {
    id: "ap_01",
    agentId: "ag_mail",
    toolName: "send_email",
    summary: '"[Daily Report] 03/10/2026" gửi tới minh@company.com, cc lan@company.com',
    createdAt: "03/10/2026 07:00",
  },
];

export function getMockSchedules(agentId: string): MockSchedule[] {
  return MOCK_SCHEDULES.filter((s) => s.agentId === agentId);
}

/** Lịch sử chạy của TẤT CẢ lịch thuộc agent này (tự nối với schedules, không cần biết scheduleId). */
export function getMockScheduleRunsForAgent(agentId: string): MockScheduleRun[] {
  const scheduleIds = new Set(getMockSchedules(agentId).map((s) => s.id));
  return MOCK_SCHEDULE_RUNS.filter((r) => scheduleIds.has(r.scheduleId));
}

export function getMockPendingApprovals(agentId: string): MockApproval[] {
  return MOCK_PENDING_APPROVALS.filter((a) => a.agentId === agentId);
}
