"use client";

import { useToast } from "@/components/ui/toast-provider";

export function RulesActions() {
  const { toast } = useToast();

  return (
    <div className="flex shrink-0 gap-2">
      <button
        type="button"
        onClick={() => {
          toast({ type: "info", message: "Đã thêm rule mới vào danh sách" });
        }}
        className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border-input bg-white px-3.5 text-sm font-medium text-text transition-colors hover:bg-sidebar md:flex-none"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Thêm rule
      </button>
      <button
        type="button"
        onClick={() => {
          toast({ type: "success", message: "Đã lưu toàn bộ thiết lập rule của agent" });
        }}
        className="h-10 flex-1 rounded-lg bg-accent px-4.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover md:flex-none"
      >
        Lưu
      </button>
    </div>
  );
}
