import { memoriesApi } from "@/lib/api/memories";
import { MemoryList } from "@/components/memories/memory-list";

/** Tab Trí nhớ của Chat chung — chỉ hồ sơ chung (không thuộc agent nào). */
export async function SharedMemoriesView() {
  const memories = await memoriesApi.listShared();
  return <MemoryList memories={memories} emptyLabel="Chưa có ghi nhớ nào." />;
}
