"use client";

import type { MockMessage } from "@/lib/mock/messages";
import { useToast } from "@/components/ui/toast-provider";

/* ─── Assistant avatar ─── */

function AssistantAvatar() {
  return (
    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-accent"
        aria-hidden="true"
      >
        <path d="M12 1l2.39 7.61L22 11l-7.61 2.39L12 21l-2.39-7.61L2 11l7.61-2.39L12 1z" />
      </svg>
    </div>
  );
}

/* ─── Copy icon SVG ─── */

function CopyIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

/* ─── MessageBubble ─── */

export function MessageBubble({ message }: { message: MockMessage }) {
  const { toast } = useToast();

  function copyContent() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(message.content);
      toast({ type: "success", message: "Đã sao chép tin nhắn vào clipboard" });
    }
  }

  if (message.role === "date") {
    return (
      <div className="self-center rounded-xl bg-sidebar px-3 py-1 text-xs text-text-muted">
        {message.content}
      </div>
    );
  }

  if (message.role === "event") {
    return (
      <div className="flex max-w-[620px] gap-3 self-start rounded-2xl border border-success-border bg-success-bg px-3.5 py-3">
        <div className="mt-0.5 shrink-0 text-success-text">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M8 12l3 3 5-6" />
          </svg>
        </div>
        <div className="flex flex-col gap-1 text-sm leading-relaxed">
          {message.time ? (
            <div className="text-xs text-text-muted">{message.time} · chạy theo lịch</div>
          ) : null}
          <div className="font-medium text-success-text-strong">{message.content}</div>
        </div>
      </div>
    );
  }

  if (message.role === "user") {
    return (
      <div className="group flex max-w-[560px] flex-col items-end self-end">
        <div className="rounded-[16px_16px_4px_16px] bg-accent px-4 py-3 text-[15px] leading-relaxed whitespace-pre-line text-white">
          {message.content}
        </div>
        <div className="invisible mt-1 flex items-center gap-1.5 text-[11px] text-text-muted opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
          <button
            type="button"
            title="Sao chép"
            onClick={copyContent}
            className="flex items-center gap-1 rounded p-0.5 text-text-muted transition-colors hover:text-text"
          >
            <CopyIcon />
          </button>
          {message.sentAt ? <span>{message.sentAt}</span> : null}
        </div>
      </div>
    );
  }

  // Assistant message — avatar + bordered bubble + hover action bar
  return (
    <div className="group flex max-w-[620px] items-start gap-2.5 self-start">
      <AssistantAvatar />
      <div className="flex flex-col">
        <div className="rounded-[16px_16px_16px_4px] border border-border bg-white px-4 py-3 text-[15px] leading-relaxed whitespace-pre-line text-text shadow-xs">
          {message.content}
        </div>
        <div className="invisible mt-1 flex items-center gap-2 text-[11px] text-text-muted opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
          {message.sentAt ? <span>{message.sentAt}</span> : null}
          <button
            type="button"
            title="Sao chép tin nhắn"
            onClick={copyContent}
            className="flex items-center gap-1 rounded px-1 py-0.5 text-text-muted transition-colors hover:bg-sidebar hover:text-text"
          >
            <CopyIcon />
            <span>Sao chép</span>
          </button>
        </div>
      </div>
    </div>
  );
}
