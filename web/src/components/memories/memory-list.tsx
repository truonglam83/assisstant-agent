import type { MockMemory } from "@/lib/mock/memories";
import { MemoryRow } from "@/components/memories/memory-row";
import { EmptyState } from "@/components/ui/empty-state";

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
          <EmptyState
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2a7 7 0 0 1 7 7c0 2.4-1.2 4.5-3 5.7V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.3C6.2 13.5 5 11.4 5 9a7 7 0 0 1 7-7z" />
                <path d="M10 21h4" />
              </svg>
            }
            title="Chưa có ghi nhớ"
            description={emptyLabel}
          />
        ) : (
          memories.map((memory) => <MemoryRow key={memory.id} memory={memory} />)
        )}
      </div>
    </div>
  );
}
