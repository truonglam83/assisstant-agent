import { agentsApi } from "@/lib/api/agents";
import { AgentSchedulesView } from "@/components/agents/agent-schedules-view";

export default async function AgentSchedulesPage(props: PageProps<"/agents/[slug]/schedules">) {
  const { slug } = await props.params;
  const agent = await agentsApi.getBySlug(slug);
  if (!agent) return null; // agents/[slug]/layout.tsx đã notFound() nếu thiếu agent

  return <AgentSchedulesView agentId={agent.id} />;
}
