"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MockMessage } from "@/lib/mock/messages";
import { messagesApi } from "@/lib/api/messages";
import { MessageBubble } from "@/components/chat/message-bubble";
import { ChatInputBar } from "@/components/chat/chat-input-bar";

/**
 * Khung tin nhắn dùng chung cho Chat chung và mọi trang agent.
 *
 * Lazy load: chỉ tải trang tin mới nhất khi vào luồng chat. Lướt lên gần đầu
 * khung chat mới gọi tải thêm trang cũ hơn (giữ nguyên vị trí scroll khi tin
 * cũ được chèn vào phía trên — không bị giật).
 *
 * Nơi gọi PHẢI truyền `key={conversationKey}` để component tự remount (và
 * reset state) khi chuyển sang luồng chat khác, thay vì tự reset trong effect.
 */
export function ChatThread({
  conversationKey,
  placeholder,
  emptyLabel,
}: {
  conversationKey: string;
  placeholder: string;
  emptyLabel: string;
}) {
  const [messages, setMessages] = useState<MockMessage[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const oldestIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    messagesApi.list(conversationKey).then(({ messages: page, hasMore: more }) => {
      if (cancelled) return;
      setMessages(page);
      oldestIdRef.current = page[0]?.id;
      setHasMore(more);
      setLoadingInitial(false);
      requestAnimationFrame(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
      });
    });

    return () => {
      cancelled = true;
    };
  }, [conversationKey]);

  const loadOlder = useCallback(async () => {
    if (loadingOlder || !hasMore) return;
    const el = scrollRef.current;
    const prevScrollHeight = el?.scrollHeight ?? 0;
    setLoadingOlder(true);

    const { messages: older, hasMore: more } = await messagesApi.list(
      conversationKey,
      oldestIdRef.current,
    );

    setMessages((prev) => [...older, ...prev]);
    if (older[0]) oldestIdRef.current = older[0].id;
    setHasMore(more);
    setLoadingOlder(false);

    requestAnimationFrame(() => {
      const elNow = scrollRef.current;
      if (elNow) elNow.scrollTop = elNow.scrollHeight - prevScrollHeight;
    });
  }, [conversationKey, hasMore, loadingOlder]);

  function handleScroll() {
    const el = scrollRef.current;
    if (el && el.scrollTop < 80) {
      loadOlder();
    }
  }

  async function handleSend(content: string) {
    const optimistic: MockMessage = { id: `local_${Date.now()}`, role: "user", content };
    setMessages((prev) => [...prev, optimistic]);
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
    await messagesApi.send(conversationKey, content);
  }

  return (
    <>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto py-5"
      >
        <div className="flex w-[760px] max-w-full flex-col gap-4 px-4">
          {loadingInitial ? (
            <div className="py-8 text-center text-sm text-text-muted">Đang tải…</div>
          ) : messages.length === 0 ? (
            <div className="text-sm text-text-muted">{emptyLabel}</div>
          ) : (
            <>
              {hasMore ? (
                <div className="pb-1 text-center text-xs text-text-muted">
                  {loadingOlder ? "Đang tải tin nhắn cũ…" : "Lướt lên để xem tin nhắn cũ"}
                </div>
              ) : (
                <div className="pb-1 text-center text-xs text-text-muted">— Đầu cuộc trò chuyện —</div>
              )}
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </>
          )}
        </div>
      </div>

      <ChatInputBar placeholder={placeholder} onSend={handleSend} />
    </>
  );
}
