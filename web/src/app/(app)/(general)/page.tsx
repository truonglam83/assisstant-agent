import { ChatThread } from "@/components/chat/chat-thread";
import { GENERAL_AGENT_ID } from "@/lib/mock/agents";

export default function ChatChungPage() {
  return (
    <ChatThread
      key={GENERAL_AGENT_ID}
      conversationKey={GENERAL_AGENT_ID}
      placeholder="Hỏi gì cũng được…"
      emptyLabel="Chưa có tin nhắn nào. Hỏi gì cũng được…"
    />
  );
}
