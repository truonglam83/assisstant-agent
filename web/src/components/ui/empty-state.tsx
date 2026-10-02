import type { ReactNode } from "react";

/**
 * Trạng thái trống dùng chung cho các trang/tab chưa có dữ liệu.
 * Hiện icon lớn + tiêu đề + mô tả tuỳ chọn, căn giữa cả khối.
 */
export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center animate-[fade-in-up_0.3s_ease-out]">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sidebar text-text-muted">
        {icon}
      </div>
      <h2 className="text-lg font-medium text-text">{title}</h2>
      {description ? (
        <p className="max-w-sm text-sm leading-relaxed text-text-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}
