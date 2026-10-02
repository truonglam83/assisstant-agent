"use client";

import { useState } from "react";
import type { MockRule } from "@/lib/mock/rules";
import { MOCK_RULE_SCOPES, MOCK_SCOPE_LABEL } from "@/lib/mock/rules";
import { useToast } from "@/components/ui/toast-provider";

/**
 * Một dòng rule trong tab Rule (docs/ui-mockup.html §3 "mail-action · Rule").
 * Chỉ dựng UI + dữ liệu mẫu — chưa lưu được, nối API sau (docs/01-frontend.md §3.4).
 *
 * Responsive: dưới `md` xếp chồng (phạm vi + bật + hành động trên 1 hàng,
 * nội dung bên dưới) — cột cố định 170px/64px/96px của bản desktop sẽ vỡ
 * trên màn hẹp. `md:contents` bỏ khung bọc mobile để 4 ô nhập vào đúng vị
 * trí lưới gốc, `md:order-*` giữ đúng thứ tự cột cũ.
 */
export function RuleRow({ rule }: { rule: MockRule }) {
  const [deleted, setDeleted] = useState(false);
  const { toast } = useToast();

  if (deleted) return null;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-white p-3.5 md:grid md:grid-cols-[170px_minmax(0,1fr)_64px_96px] md:items-start md:gap-3.5">
      <div className="flex items-center gap-2 md:contents">
        <div className="flex-1 md:order-1">
          <label className="sr-only" htmlFor={`rule-scope-${rule.id}`}>
            Phạm vi
          </label>
          <select
            id={`rule-scope-${rule.id}`}
            defaultValue={rule.scope}
            onChange={(e) => {
              const scopeVal = e.target.value;
              toast({
                type: "info",
                message: `Đã đổi phạm vi sang "${MOCK_SCOPE_LABEL[scopeVal] ?? scopeVal}"`,
              });
            }}
            className="h-10 w-full rounded-lg border border-border-input bg-white px-2.5 text-sm text-text"
          >
            {MOCK_RULE_SCOPES.map((scope) => (
              <option key={scope} value={scope}>
                {MOCK_SCOPE_LABEL[scope] ?? scope}
              </option>
            ))}
          </select>
        </div>

        <label className="flex h-10 shrink-0 items-center md:order-3">
          <span className="sr-only">Bật rule</span>
          <input
            type="checkbox"
            defaultChecked={rule.enabled}
            onChange={(e) => {
              toast({
                type: "info",
                message: e.target.checked
                  ? `Đã kích hoạt rule "${rule.title}"`
                  : `Đã tạm tắt rule "${rule.title}"`,
              });
            }}
            className="h-5 w-5 accent-accent"
          />
        </label>

        <div className="flex h-10 shrink-0 items-center gap-1 md:order-4">
          <button
            type="button"
            aria-label="Lịch sử"
            onClick={() => {
              toast({
                type: "info",
                message: `Xem lịch sử chỉnh sửa của "${rule.title}" (Mock)`,
              });
            }}
            className="flex h-10 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-sidebar md:w-11"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Xoá"
            onClick={() => {
              setDeleted(true);
              toast({
                type: "success",
                message: `Đã xoá rule "${rule.title}"`,
              });
            }}
            className="flex h-10 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-danger-bg hover:text-danger md:w-11"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 md:order-2">
        <label className="sr-only" htmlFor={`rule-title-${rule.id}`}>
          Tên rule
        </label>
        <input
          id={`rule-title-${rule.id}`}
          defaultValue={rule.title}
          className="h-10 rounded-lg border border-border-input bg-white px-3 text-sm font-semibold text-text"
        />
        <label className="sr-only" htmlFor={`rule-content-${rule.id}`}>
          Nội dung rule
        </label>
        <textarea
          id={`rule-content-${rule.id}`}
          defaultValue={rule.content}
          rows={2}
          className="resize-y rounded-lg border border-border-input px-3 py-2 text-sm leading-relaxed text-text"
        />
      </div>
    </div>
  );
}
