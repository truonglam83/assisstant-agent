import { schedulesApi } from "@/lib/api/schedules";
import { approvalsApi } from "@/lib/api/approvals";
import { costsApi } from "@/lib/api/costs";
import { ApprovalCard } from "@/components/agents/approval-card";
import { ScheduleEnableToggle } from "@/components/agents/schedule-enable-toggle";
import { CostTiles } from "@/components/costs/cost-tiles";
import type { ScheduleMode, ScheduleRunStatus } from "@/lib/mock/schedules";

const MODE_LABEL: Record<ScheduleMode, string> = {
  auto_send: "Tự gửi",
  draft_for_approval: "Chờ duyệt",
};

const RUN_STATUS_STYLE: Record<ScheduleRunStatus, string> = {
  sent: "bg-success-bg text-success-text",
  skipped_no_input: "bg-badge/10 text-badge",
  failed: "bg-danger-bg text-danger-text",
};

const RUN_STATUS_LABEL: Record<ScheduleRunStatus, string> = {
  sent: "Đã gửi",
  skipped_no_input: "Bỏ qua (thiếu nội dung)",
  failed: "Lỗi",
};

/**
 * Nội dung tab Lịch của 1 agent: lịch chạy, chờ duyệt, lịch sử chạy, chi phí
 * — TẤT CẢ chỉ của agent này. Chỉ cần `agentId`, tự gọi API (mock) lấy dữ liệu.
 */
export async function AgentSchedulesView({ agentId }: { agentId: string }) {
  const [schedules, runs, approvals, cost] = await Promise.all([
    schedulesApi.list(agentId),
    schedulesApi.listRuns(agentId),
    approvalsApi.listPending(agentId),
    costsApi.getForAgent(agentId),
  ]);

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center gap-7 overflow-y-auto py-6">
      <div className="flex w-[820px] max-w-full flex-col gap-7 px-4">
        <section className="flex flex-col gap-2.5">
          <h2 className="text-sm font-semibold text-text-muted">Chờ duyệt</h2>
          {approvals.length === 0 ? (
            <p className="text-sm text-text-muted">Không có việc nào đang chờ duyệt.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {approvals.map((approval) => (
                <ApprovalCard key={approval.id} approval={approval} />
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-2.5">
          <h2 className="text-sm font-semibold text-text-muted">Lịch chạy</h2>
          {schedules.length === 0 ? (
            <p className="text-sm text-text-muted">Agent này chưa có lịch chạy nào.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border bg-white p-4"
                >
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-semibold text-text">{schedule.name}</div>
                    <div className="text-xs text-text-muted">{schedule.cronLabel}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
                      {MODE_LABEL[schedule.mode]}
                    </span>
                    <ScheduleEnableToggle scheduleId={schedule.id} defaultEnabled={schedule.enabled} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-2.5">
          <h2 className="text-sm font-semibold text-text-muted">Lịch sử chạy gần đây</h2>
          {runs.length === 0 ? (
            <p className="text-sm text-text-muted">Chưa có lần chạy nào.</p>
          ) : (
            <div className="flex flex-col gap-2 rounded-xl border border-border bg-white p-2">
              {runs.map((run) => (
                <div
                  key={run.id}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="shrink-0 text-xs text-text-muted">{run.runDate}</span>
                    <span className="truncate text-text">{run.summary}</span>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${RUN_STATUS_STYLE[run.status]}`}
                  >
                    {RUN_STATUS_LABEL[run.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-2.5 pb-4">
          <h2 className="text-sm font-semibold text-text-muted">Chi phí của agent này</h2>
          <CostTiles todayUsd={cost.todayUsd} monthUsd={cost.monthUsd} />
        </section>
      </div>
    </div>
  );
}
