"use client";

import { useState } from "react";
import type { MockRule } from "@/lib/mock/rules";
import { MOCK_RULE_SCOPES, MOCK_SCOPE_LABEL } from "@/lib/mock/rules";
import { rulesApi, type RuleVersion } from "@/lib/api/rules";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast-provider";

export function RuleRow({ rule }: { rule: MockRule }) {
  const [deleted, setDeleted] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [enabled, setEnabled] = useState(rule.enabled);
  const [scope, setScope] = useState(rule.scope);
  const [title, setTitle] = useState(rule.title);
  const [content, setContent] = useState(rule.content);

  const [showHistory, setShowHistory] = useState(false);
  const [versions, setVersions] = useState<RuleVersion[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);

  const { toast } = useToast();

  if (deleted) return null;

  async function handleDelete() {
    try {
      await rulesApi.remove(rule.id);
      setDeleted(true);
      toast({
        type: "success",
        message: `Đã xoá rule "${title}"`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể xoá rule";
      toast({ type: "error", message: msg });
    } finally {
      setShowDeleteConfirm(false);
    }
  }

  async function handleToggle(checked: boolean) {
    const prev = enabled;
    setEnabled(checked); // Optimistic UI
    try {
      await rulesApi.update(rule.id, { enabled: checked });
      toast({
        type: "info",
        message: checked
          ? `Đã kích hoạt rule "${title}"`
          : `Đã tạm tắt rule "${title}"`,
      });
    } catch (err: unknown) {
      setEnabled(prev); // Rollback khi lỗi (ví dụ quy tắc tối thiểu 1 rule bật)
      const msg = err instanceof Error ? err.message : "Lỗi khi cập nhật rule";
      toast({ type: "error", message: msg });
    }
  }

  async function handleScopeChange(nextScope: string) {
    const prev = scope;
    setScope(nextScope);
    try {
      await rulesApi.update(rule.id, { scope: nextScope });
      toast({
        type: "info",
        message: `Đã đổi phạm vi sang "${MOCK_SCOPE_LABEL[nextScope] ?? nextScope}"`,
      });
    } catch (err: unknown) {
      setScope(prev); // Rollback
      const msg = err instanceof Error ? err.message : "Lỗi khi đổi phạm vi";
      toast({ type: "error", message: msg });
    }
  }

  async function handleTitleBlur(nextTitle: string) {
    const trimmed = nextTitle.trim();
    if (!trimmed || trimmed === rule.title) return;
    try {
      await rulesApi.update(rule.id, { title: trimmed });
      toast({ type: "success", message: `Đã đổi tên rule thành "${trimmed}"` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi đổi tên rule";
      toast({ type: "error", message: msg });
    }
  }

  async function handleContentBlur(nextContent: string) {
    const trimmed = nextContent.trim();
    if (!trimmed || trimmed === rule.content) return;
    try {
      await rulesApi.update(rule.id, {
        content: trimmed,
        changeReason: "Sửa nội dung từ giao diện",
      });
      toast({
        type: "success",
        message: `Đã cập nhật nội dung rule "${title}" (tạo bản ghi lịch sử mới)`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi lưu nội dung rule";
      toast({ type: "error", message: msg });
    }
  }

  async function handleOpenHistory() {
    setShowHistory(true);
    setLoadingVersions(true);
    try {
      const list = await rulesApi.getVersions(rule.id);
      setVersions(list);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Không thể tải lịch sử phiên bản";
      toast({ type: "error", message: msg });
    } finally {
      setLoadingVersions(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-white p-3.5 md:grid md:grid-cols-[170px_minmax(0,1fr)_64px_96px] md:items-start md:gap-3.5">
        <div className="flex items-center gap-2 md:contents">
          <div className="flex-1 md:order-1">
            <label className="sr-only" htmlFor={`rule-scope-${rule.id}`}>
              Phạm vi
            </label>
            <select
              id={`rule-scope-${rule.id}`}
              value={scope}
              onChange={(e) => handleScopeChange(e.target.value)}
              className="h-10 w-full rounded-lg border border-border-input bg-white px-2.5 text-sm text-text"
            >
              {MOCK_RULE_SCOPES.map((s) => (
                <option key={s} value={s}>
                  {MOCK_SCOPE_LABEL[s] ?? s}
                </option>
              ))}
            </select>
          </div>

          <label className="flex h-10 shrink-0 items-center md:order-3">
            <span className="sr-only">Bật rule</span>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => handleToggle(e.target.checked)}
              className="h-5 w-5 accent-accent"
            />
          </label>

          <div className="flex h-10 shrink-0 items-center gap-1 md:order-4">
            <button
              type="button"
              aria-label="Lịch sử"
              onClick={handleOpenHistory}
              title="Xem lịch sử chỉnh sửa"
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
              onClick={() => setShowDeleteConfirm(true)}
              title="Xoá rule"
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={(e) => handleTitleBlur(e.target.value)}
            className="h-10 rounded-lg border border-border-input bg-white px-3 text-sm font-semibold text-text"
          />
          <label className="sr-only" htmlFor={`rule-content-${rule.id}`}>
            Nội dung rule
          </label>
          <textarea
            id={`rule-content-${rule.id}`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={(e) => handleContentBlur(e.target.value)}
            rows={2}
            className="resize-y rounded-lg border border-border-input px-3 py-2 text-sm leading-relaxed text-text"
          />
        </div>
      </div>

      {showDeleteConfirm ? (
        <ConfirmDialog
          title="Xoá rule này?"
          description={`Bạn có chắc chắn muốn xoá rule "${title}" không? Hành động này sẽ xoá mềm rule khỏi agent.`}
          confirmLabel="Xoá"
          danger
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
        />
      ) : null}

      {showHistory ? (
        <Dialog
          onClose={() => setShowHistory(false)}
          widthClassName="max-w-[560px]"
        >
          <div className="flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-serif text-lg font-semibold text-text">
                Lịch sử phiên bản: {title}
              </h2>
              <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="text-sm text-text-muted hover:text-text"
              >
                Đóng
              </button>
            </div>

            {loadingVersions ? (
              <p className="py-6 text-center text-sm text-text-muted">
                Đang tải lịch sử phiên bản…
              </p>
            ) : versions.length === 0 ? (
              <p className="py-6 text-center text-sm text-text-muted">
                Chưa có lịch sử phiên bản nào được ghi nhận.
              </p>
            ) : (
              <div className="flex max-h-[360px] flex-col gap-3 overflow-y-auto pr-1">
                {versions.map((ver) => (
                  <div
                    key={ver.id}
                    className="flex flex-col gap-1.5 rounded-lg border border-border bg-sidebar p-3 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-accent">
                        Phiên bản v{ver.version}
                      </span>
                      <span className="text-xs text-text-muted">
                        {new Date(ver.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                    {ver.changeReason ? (
                      <p className="text-xs italic text-text-muted">
                        Lý do: {ver.changeReason}
                      </p>
                    ) : null}
                    <pre className="mt-1 whitespace-pre-wrap rounded bg-white p-2 font-sans text-xs text-text">
                      {ver.content}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Dialog>
      ) : null}
    </>
  );
}
