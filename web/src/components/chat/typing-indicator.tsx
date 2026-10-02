/**
 * Hiệu ứng 3 chấm nhảy khi trợ lý đang soạn tin nhắn.
 * Dùng cùng avatar trợ lý (sparkle) để nhất quán với MessageBubble.
 */
export function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5 self-start">
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
      <div className="rounded-[16px_16px_16px_4px] border border-border bg-white px-4 py-3.5 shadow-xs">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-text-muted animate-[typing-dot_1.4s_ease-in-out_infinite]" />
          <span className="h-2 w-2 rounded-full bg-text-muted animate-[typing-dot_1.4s_ease-in-out_0.2s_infinite]" />
          <span className="h-2 w-2 rounded-full bg-text-muted animate-[typing-dot_1.4s_ease-in-out_0.4s_infinite]" />
        </div>
      </div>
    </div>
  );
}
