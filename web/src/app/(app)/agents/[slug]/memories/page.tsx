import { agentsApi } from "@/lib/api/agents";
import { AgentMemoriesView } from "@/components/agents/agent-memories-view";

export default async function AgentMemoriesPage(props: PageProps<"/agents/[slug]/memories">) {
  const { slug } = await props.params;
  const agent = await agentsApi.getBySlug(slug);
  if (!agent) return null; // agents/[slug]/layout.tsx đã notFound() nếu thiếu agent

  return <AgentMemoriesView agentId={agent.id} />;
}
