"use client";

import { useSidebarDrawer } from "@/components/layout/sidebar-drawer-provider";

export function SidebarCloseButton() {
  const { close } = useSidebarDrawer();

  return (
    <button
      type="button"
      aria-label="Đóng menu"
      onClick={close}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted md:hidden"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  );
}
