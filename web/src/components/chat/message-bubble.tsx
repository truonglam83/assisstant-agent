import type { MockMessage } from "@/lib/mock/messages";

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
      <div className="max-w-[560px] self-end rounded-[16px_16px_4px_16px] bg-accent px-4 py-3 text-[15px] leading-relaxed whitespace-pre-line text-white">
        {message.content}
      </div>
    );
  }

  return (
    <div className="max-w-[560px] self-start rounded-[16px_16px_16px_4px] border border-border bg-white px-4 py-3 text-[15px] leading-relaxed whitespace-pre-line text-text">
      {message.content}
    </div>
  );
}
