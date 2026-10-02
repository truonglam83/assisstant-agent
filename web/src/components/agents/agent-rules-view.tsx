import { rulesApi } from "@/lib/api/rules";
import { RuleRow } from "@/components/agents/rule-row";

/**
 * Nội dung tab Rule của 1 agent. Chỉ cần `agentId` — tự gọi API (mock) lấy
 * dữ liệu, page.tsx chỉ lo resolve slug → agentId rồi render component này.
 */
export async function AgentRulesView({ agentId }: { agentId: string }) {
  const rules = await rulesApi.list(agentId);

  return (
    <div className="flex min-h-0 flex-1 justify-center overflow-y-auto py-4 md:py-6">
      <div className="flex w-[860px] max-w-full flex-col gap-3.5 px-3 md:px-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-text">Rule của agent</h2>
            <p className="text-sm leading-relaxed text-text-muted">
              Rule là cách làm: format, cấu trúc, văn phong, chữ ký. Người nhận và nội
              dung bạn nói trong tin nhắn.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border-input bg-white px-3.5 text-sm font-medium text-text md:flex-none"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Thêm rule
            </button>
            <button
              type="button"
              className="h-10 flex-1 rounded-lg bg-accent px-4.5 text-sm font-semibold text-white hover:bg-accent-hover md:flex-none"
            >
              Lưu
            </button>
          </div>
        </div>

        <div className="hidden grid-cols-[170px_minmax(0,1fr)_64px_96px] gap-3.5 px-4 text-xs font-semibold tracking-wide text-text-muted md:grid">
          <div>PHẠM VI</div>
          <div>TÊN · NỘI DUNG</div>
          <div>BẬT</div>
          <div />
        </div>

        {/* TODO: nối tool propose_rule_change khi có agent thật, thay vì chỉ đọc. */}
        {rules.length === 0 ? (
          <div className="px-4 text-sm text-text-muted">Chưa có rule nào.</div>
        ) : (
          rules.map((rule) => <RuleRow key={rule.id} rule={rule} />)
        )}
      </div>
    </div>
  );
}
