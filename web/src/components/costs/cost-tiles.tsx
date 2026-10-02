function formatUsd(usd: number) {
  return `$${usd.toFixed(3)}`;
}

/** 2 ô số liệu (hôm nay / tháng này) — dùng chung cho trang Chi phí global và tab Lịch của agent. */
export function CostTiles({ todayUsd, monthUsd }: { todayUsd: number; monthUsd: number }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl border border-border bg-white p-4">
        <div className="text-xs text-text-muted">Hôm nay</div>
        <div className="mt-1 font-serif text-2xl font-semibold text-text">
          {formatUsd(todayUsd)}
        </div>
      </div>
      <div className="rounded-xl border border-border bg-white p-4">
        <div className="text-xs text-text-muted">Tháng này</div>
        <div className="mt-1 font-serif text-2xl font-semibold text-text">
          {formatUsd(monthUsd)}
        </div>
      </div>
    </div>
  );
}
