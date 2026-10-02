"use client";

import { useId, useState, type KeyboardEvent } from "react";

/**
 * Thanh nhập tin nhắn cố định cuối khung chat (đóng vai trò "footer" của mỗi
 * màn hình chat, theo docs/ui-mockup.html). Enter gửi tin nhắn, Shift+Enter
 * xuống dòng. Chưa nối API thật — `onSend` do nơi gọi tự quyết định làm gì
 * (hiện đang gọi `messagesApi.send`, xem chat-thread.tsx).
 */
export function ChatInputBar({
  placeholder,
  onSend,
}: {
  placeholder: string;
  onSend?: (content: string) => void | Promise<void>;
}) {
  const id = useId();
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);

  async function submit() {
    const content = value.trim();
    if (!content || sending) return;
    setValue("");
    setSending(true);
    await onSend?.(content);
    setSending(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="flex shrink-0 justify-center px-4 pb-6 pt-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex w-full max-w-[720px] items-end gap-2.5 rounded-2xl border border-border-input bg-white p-3 pl-4.5 shadow-xs"
      >
        <label htmlFor={id} className="sr-only">
          Tin nhắn
        </label>
        <textarea
          id={id}
          rows={2}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-0 flex-1 resize-none bg-transparent text-[15px] leading-relaxed text-text outline-none placeholder:text-text-muted"
        />
        <button
          type="submit"
          disabled={sending || !value.trim()}
          aria-label="Gửi"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-white hover:bg-accent-hover disabled:opacity-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </form>
    </div>
  );
}
