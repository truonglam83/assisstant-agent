import { ChatThread } from "@/components/chat/chat-thread";
import { agentsApi } from "@/lib/api/agents";

export default async function AgentChatPage(props: PageProps<"/agents/[slug]">) {
  const { slug } = await props.params;
  const agent = await agentsApi.getBySlug(slug);
  if (!agent) return null; // agents/[slug]/layout.tsx đã notFound() nếu thiếu agent

  return (
    <ChatThread
      key={agent.id}
      conversationKey={agent.id}
      placeholder={`Nhắn cho ${agent.name}: người nhận, nội dung…`}
      emptyLabel={`Chưa có tin nhắn nào với ${agent.name}.`}
    />
  );
}
