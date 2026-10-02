import type { MockMessage } from "@/lib/mock/messages";

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

/* ─── Hover timestamp ─── */

function HoverTime({ time, align = "left" }: { time?: string; align?: "left" | "right" }) {
  if (!time) return null;
  return (
    <div
      className={`invisible mt-1 text-[11px] text-text-muted opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {time}
    </div>
  );
}

/* ─── MessageBubble ─── */

export function MessageBubble({ message }: { message: MockMessage }) {
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
        <HoverTime time={message.sentAt} align="right" />
      </div>
    );
  }

  // Assistant message — avatar + bordered bubble + hover timestamp
  return (
    <div className="group flex max-w-[620px] items-start gap-2.5 self-start">
      <AssistantAvatar />
      <div className="flex flex-col">
        <div className="rounded-[16px_16px_16px_4px] border border-border bg-white px-4 py-3 text-[15px] leading-relaxed whitespace-pre-line text-text shadow-xs">
          {message.content}
        </div>
        <HoverTime time={message.sentAt} />
      </div>
    </div>
  );
}
