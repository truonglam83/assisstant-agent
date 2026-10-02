"use client";

import { useEffect, type MouseEvent, type ReactNode } from "react";

/**
 * Khung popup dùng chung: overlay mờ + hộp trắng bo góc giữa màn hình.
 * Đóng bằng phím Esc hoặc bấm ra ngoài. Nội dung bên trong tự lo header/form/footer.
 */
export function Dialog({
  onClose,
  children,
  widthClassName = "max-w-[640px]",
}: {
  onClose: () => void;
  children: ReactNode;
  widthClassName?: string;
}) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function handleBackdropClick(e: MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-text/45 px-4"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`flex max-h-[85vh] w-full ${widthClassName} flex-col overflow-hidden rounded-2xl bg-white`}
      >
        {children}
      </div>
    </div>
  );
}
