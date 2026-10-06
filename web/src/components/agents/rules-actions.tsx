"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast-provider";
import { Dialog } from "@/components/ui/dialog";
import { rulesApi } from "@/lib/api/rules";
import { MOCK_RULE_SCOPES, MOCK_SCOPE_LABEL } from "@/lib/mock/rules";

export function RulesActions({ agentId }: { agentId?: string }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [scope, setScope] = useState<string>("all");
  const [submitting, setSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  async function handleCreateRule(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({
        type: "error",
        message: "Vui lòng nhập tên và nội dung rule",
      });
      return;
    }

    if (!agentId) {
      toast({
        type: "error",
        message: "Không tìm thấy mã Agent để thêm rule",
      });
      return;
    }

    setSubmitting(true);
    try {
      await rulesApi.create(agentId, {
        title: title.trim(),
        content: content.trim(),
        scope,
        enabled: true,
      });
      toast({
        type: "success",
        message: `Đã thêm rule mới "${title.trim()}"`,
      });
      setShowCreateModal(false);
      setTitle("");
      setContent("");
      setScope("all");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi thêm rule mới";
      toast({ type: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
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
            toast({
              type: "success",
              message: "Các thay đổi rule được tự động lưu vào hệ thống.",
            });
          }}
          className="h-10 flex-1 rounded-lg bg-accent px-4.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover md:flex-none"
        >
          Đã đồng bộ
        </button>
      </div>

      {showCreateModal ? (
        <Dialog
          onClose={() => setShowCreateModal(false)}
          widthClassName="max-w-[500px]"
        >
          <form onSubmit={handleCreateRule} className="flex flex-col gap-4 p-6">
            <h2 className="font-serif text-lg font-semibold text-text">
              Thêm rule mới cho agent
            </h2>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="new-rule-title"
                className="text-xs font-semibold text-text-muted"
              >
                TÊN RULE
              </label>
              <input
                id="new-rule-title"
                placeholder="VD: Định dạng email, Cách xưng hô…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-10 rounded-lg border border-border-input bg-white px-3 text-sm text-text"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="new-rule-scope"
                className="text-xs font-semibold text-text-muted"
              >
                PHẠM VI ÁP DỤNG
              </label>
              <select
                id="new-rule-scope"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="h-10 rounded-lg border border-border-input bg-white px-2.5 text-sm text-text"
              >
                {MOCK_RULE_SCOPES.map((s) => (
                  <option key={s} value={s}>
                    {MOCK_SCOPE_LABEL[s] ?? s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="new-rule-content"
                className="text-xs font-semibold text-text-muted"
              >
                NỘI DUNG RULE
              </label>
              <textarea
                id="new-rule-content"
                placeholder="Mô tả cụ thể cách làm, quy tắc, định dạng…"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                required
                className="resize-y rounded-lg border border-border-input px-3 py-2 text-sm leading-relaxed text-text"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="h-10 rounded-lg border border-border-input px-4 text-sm font-medium text-text hover:bg-sidebar"
              >
                Huỷ
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="h-10 rounded-lg bg-accent px-5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
              >
                {submitting ? "Đang lưu…" : "Thêm rule"}
              </button>
            </div>
          </form>
        </Dialog>
      ) : null}
    </>
  );
}
