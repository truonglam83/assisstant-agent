import { agentsApi } from "@/lib/api/agents";
import { AgentRulesView } from "@/components/agents/agent-rules-view";

export default async function AgentRulesPage(props: PageProps<"/agents/[slug]/rules">) {
  const { slug } = await props.params;
  const agent = await agentsApi.getBySlug(slug);
  if (!agent) return null; // agents/[slug]/layout.tsx đã notFound() nếu thiếu agent

  return <AgentRulesView agentId={agent.id} />;
}
