import type { MockMemory } from "@/lib/mock/memories";
import { MemoryRow } from "@/components/memories/memory-row";

/** Danh sách ghi nhớ — component trình bày dùng chung cho hồ sơ chung (Chat chung) và ghi nhớ riêng agent. */
export function MemoryList({
  memories,
  emptyLabel,
}: {
  memories: MockMemory[];
  emptyLabel: string;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center gap-2.5 overflow-y-auto py-6">
      <div className="flex w-[760px] max-w-full flex-col gap-2.5 px-4">
        {memories.length === 0 ? (
          <p className="text-sm text-text-muted">{emptyLabel}</p>
        ) : (
          memories.map((memory) => <MemoryRow key={memory.id} memory={memory} />)
        )}
      </div>
    </div>
  );
}
