import { memoriesApi } from "@/lib/api/memories";
import { MemoryList } from "@/components/memories/memory-list";

/** Nội dung tab Trí nhớ của 1 agent — chỉ ghi nhớ riêng agent đó. */
export async function AgentMemoriesView({ agentId }: { agentId: string }) {
  const memories = await memoriesApi.list(agentId);
  return <MemoryList memories={memories} emptyLabel="Agent này chưa có ghi nhớ riêng nào." />;
}
