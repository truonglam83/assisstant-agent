"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MockMessage } from "@/lib/mock/messages";
import { messagesApi } from "@/lib/api/messages";
import { MessageBubble } from "@/components/chat/message-bubble";
import { ChatInputBar } from "@/components/chat/chat-input-bar";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { ChatSkeleton } from "@/components/chat/chat-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast-provider";

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
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const oldestIdRef = useRef<string | undefined>(undefined);
  const mockTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (mockTimeoutRef.current) clearTimeout(mockTimeoutRef.current);
    };
  }, []);

  /* ── Scroll helpers ── */

  function scrollToBottom(smooth = true) {
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "instant" });
    });
  }

  /* ── Initial load ── */

  useEffect(() => {
    let cancelled = false;

    messagesApi.list(conversationKey).then(({ messages: page, hasMore: more }) => {
      if (cancelled) return;
      setMessages(page);
      oldestIdRef.current = page[0]?.id;
      setHasMore(more);
      setLoadingInitial(false);
      scrollToBottom(false);
    });

    return () => {
      cancelled = true;
    };
  }, [conversationKey]);

  /* ── Load older ── */

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

  /* ── Scroll handler (load older + show/hide scroll button) ── */

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop < 80) loadOlder();

    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 200);
  }

  /* ── Send message ── */

  async function handleSend(content: string) {
    const now = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const optimistic: MockMessage = {
      id: `local_${Date.now()}`,
      role: "user",
      content,
      sentAt: now,
    };
    setMessages((prev) => [...prev, optimistic]);
    setIsWaitingResponse(true);
    scrollToBottom();

    if (mockTimeoutRef.current) {
      clearTimeout(mockTimeoutRef.current);
    }

    try {
      await messagesApi.send(conversationKey, content);
    } catch (error) {
      setIsWaitingResponse(false);
      const msg = error instanceof Error ? error.message : "Gửi tin nhắn thất bại";
      toast({ type: "error", message: msg });
      return;
    }

    // Mock: giả lập trợ lý đang gõ rồi trả lời sau 1.5s.
    // Khi có API thật (SSE, docs/02-backend-api.md §3.3), thay bằng stream handler.
    mockTimeoutRef.current = setTimeout(() => {
      setIsWaitingResponse(false);
      const lower = content.toLowerCase();
      const isEmailQuery =
        lower.includes("mail") ||
        lower.includes("report") ||
        lower.includes("báo cáo") ||
        lower.includes("gửi");

      const response: MockMessage = {
        id: `local_${Date.now()}_resp`,
        role: "assistant",
        content: isEmailQuery
          ? "Việc này agent **mail-action** làm được. Bạn có thể mở agent rồi nhắn người nhận và nội dung, agent sẽ soạn và gửi theo lịch."
          : "Cảm ơn bạn, mình đã nhận tin nhắn. (Mock — API thật sẽ trả lời ở đây.)",
        sentAt: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        suggestedAgentSlug: isEmailQuery ? "mail-action" : undefined,
      };
      setMessages((prev) => [...prev, response]);
      scrollToBottom();
    }, 1500);
  }

  /* ── Chat empty icon ── */

  const chatIcon = (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
    </svg>
  );

  /* ── Render ── */

  return (
    <>
      {/* Wrapper: relative so the scroll-to-bottom button can float */}
      <div className="relative min-h-0 flex-1">
        {/* Scrollable message area */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="absolute inset-0 flex flex-col items-center overflow-y-auto px-4 py-5 [scrollbar-gutter:stable]"
        >
          <div className="flex w-full max-w-[720px] flex-col gap-5">
            {loadingInitial ? (
              <ChatSkeleton />
            ) : messages.length === 0 ? (
              <EmptyState
                icon={chatIcon}
                title="Chưa có tin nhắn"
                description={emptyLabel}
              />
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
                {isWaitingResponse ? <TypingIndicator /> : null}
              </>
            )}
          </div>
        </div>

        {/* Scroll-to-bottom floating button */}
        {showScrollBtn ? (
          <button
            type="button"
            onClick={() => scrollToBottom()}
            className="absolute bottom-4 left-1/2 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-white shadow-md transition-all hover:bg-sidebar"
            aria-label="Cuộn xuống cuối"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        ) : null}
      </div>

      <ChatInputBar placeholder={placeholder} onSend={handleSend} />
    </>
  );
}
