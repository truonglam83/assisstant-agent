import { costsApi } from "@/lib/api/costs";
import { CostTiles } from "@/components/costs/cost-tiles";
import { MobileMenuButton } from "@/components/layout/mobile-menu-button";
import { getMockAgentNameById } from "@/lib/mock/agents";

/** Chi phí TỔNG mọi agent. Chi phí riêng từng agent nằm ở tab Lịch của agent đó. */
export default async function CostsPage() {
  const { todayUsd, monthUsd, byAgent } = await costsApi.getTotal();

  return (
    <>
      <header className="flex h-[68px] shrink-0 items-center gap-2 border-b border-border px-3 md:gap-0 md:px-8">
        <MobileMenuButton />
        <div className="flex flex-col gap-0.5">
          <h1 className="font-serif text-lg font-semibold text-text md:text-[22px]">Chi phí</h1>
          <div className="hidden text-[13px] text-text-muted md:block">
            Tổng chi phí mọi agent — xem riêng từng agent ở tab Lịch của agent đó
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col items-center gap-3 overflow-y-auto py-6">
        <div className="flex w-[640px] max-w-full flex-col gap-3 px-4">
          <CostTiles todayUsd={todayUsd} monthUsd={monthUsd} />

          <div className="flex flex-col gap-2 rounded-xl border border-border bg-white p-2">
            {byAgent.map((row) => (
              <div
                key={row.agentId}
                className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm"
              >
                <span className="text-text">{getMockAgentNameById(row.agentId)}</span>
                <span className="text-text-muted">
                  ${row.todayUsd.toFixed(3)} hôm nay · ${row.monthUsd.toFixed(3)} tháng này
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
