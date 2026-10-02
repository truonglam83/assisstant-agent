/**
 * Skeleton placeholder hiệu ứng pulse, thay thế "Đang tải…" thuần text
 * trong ChatThread khi đang tải tin nhắn ban đầu.
 */
export function ChatSkeleton() {
  return (
    <div className="flex w-full flex-col gap-6 py-4">
      {/* Assistant skeleton */}
      <div className="flex items-start gap-2.5 self-start">
        <div className="h-7 w-7 animate-pulse rounded-full bg-border" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-72 animate-pulse rounded-lg bg-border" />
          <div className="h-4 w-52 animate-pulse rounded-lg bg-border" />
        </div>
      </div>

      {/* User skeleton */}
      <div className="flex flex-col items-end gap-2 self-end">
        <div className="h-4 w-44 animate-pulse rounded-lg bg-border" />
      </div>

      {/* Another assistant skeleton */}
      <div className="flex items-start gap-2.5 self-start">
        <div className="h-7 w-7 animate-pulse rounded-full bg-border" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-80 animate-pulse rounded-lg bg-border" />
          <div className="h-4 w-60 animate-pulse rounded-lg bg-border" />
          <div className="h-4 w-36 animate-pulse rounded-lg bg-border" />
        </div>
      </div>

      {/* Another user skeleton */}
      <div className="flex flex-col items-end gap-2 self-end">
        <div className="h-4 w-56 animate-pulse rounded-lg bg-border" />
        <div className="h-4 w-32 animate-pulse rounded-lg bg-border" />
      </div>
    </div>
  );
}
