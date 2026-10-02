"use client";

import { useState } from "react";
import type { MockMemory } from "@/lib/mock/memories";
import { memoriesApi } from "@/lib/api/memories";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast-provider";

const CATEGORY_LABEL: Record<string, string> = {
  profile: "Hồ sơ",
  preference: "Sở thích",
  person: "Liên hệ",
  project: "Dự án",
};

export function MemoryRow({ memory }: { memory: MockMemory }) {
  const [pinned, setPinned] = useState(memory.pinned);
  const [content, setContent] = useState(memory.content);
  const [draft, setDraft] = useState(memory.content);
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [pending, setPending] = useState(false);
  const { toast } = useToast();

  async function togglePin() {
    const previousPinned = pinned;
    const next = !pinned;
    setPinned(next);
    setPending(true);
    try {
      await memoriesApi.update(memory.id, { pinned: next });
      toast({
        type: "info",
        message: next ? "Đã ghim ghi nhớ lên đầu" : "Đã bỏ ghim ghi nhớ",
      });
    } catch (error) {
      setPinned(previousPinned); // Rollback
      const msg = error instanceof Error ? error.message : "Thao tác thất bại";
      toast({ type: "error", message: `Không thể cập nhật ghim: ${msg}` });
    } finally {
      setPending(false);
    }
  }

  async function saveEdit() {
    if (!draft.trim()) return;
    setPending(true);
    try {
      await memoriesApi.update(memory.id, { content: draft });
      setContent(draft);
      setEditing(false);
      toast({ type: "success", message: "Đã cập nhật nội dung ghi nhớ" });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Thao tác thất bại";
      toast({ type: "error", message: `Không thể lưu ghi nhớ: ${msg}` });
    } finally {
      setPending(false);
    }
  }

  if (deleted) return null;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-white p-3.5">
      <button
        type="button"
        aria-label={pinned ? "Bỏ ghim" : "Ghim"}
        disabled={pending}
        onClick={togglePin}
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          pinned ? "text-accent" : "text-text-muted"
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={pinned ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 3h12v18l-6-4-6 4z" />
        </svg>
      </button>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
          <span className="rounded-full bg-accent-soft px-2 py-0.5 font-medium text-accent">
            {CATEGORY_LABEL[memory.category] ?? memory.category}
          </span>
        </div>

        {editing ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={2}
              className="resize-y rounded-lg border border-border-input px-3 py-2 text-sm leading-relaxed text-text"
            />
            <div className="flex gap-2">
              <button
                type="button"
                disabled={pending}
                onClick={saveEdit}
                className="h-8 rounded-lg bg-accent px-3 text-xs font-semibold text-white disabled:opacity-60"
              >
                Lưu
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraft(content);
                  setEditing(false);
                }}
                className="h-8 rounded-lg border border-border-input px-3 text-xs font-medium text-text"
              >
                Huỷ
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-text">{content}</p>
        )}
      </div>

      {!editing ? (
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            aria-label="Sửa"
            onClick={() => setEditing(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Xoá"
            onClick={() => setConfirmingDelete(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
            </svg>
          </button>
        </div>
      ) : null}

      {confirmingDelete ? (
        <ConfirmDialog
          title="Xoá ghi nhớ này?"
          description={content}
          confirmLabel="Xoá"
          danger
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={async () => {
            try {
              await memoriesApi.remove(memory.id);
              setDeleted(true);
              setConfirmingDelete(false);
              toast({ type: "success", message: "Đã xoá ghi nhớ" });
            } catch (error) {
              const msg = error instanceof Error ? error.message : "Thao tác thất bại";
              toast({ type: "error", message: `Không thể xoá ghi nhớ: ${msg}` });
              setConfirmingDelete(false);
            }
          }}
        />
      ) : null}
    </div>
  );
}
