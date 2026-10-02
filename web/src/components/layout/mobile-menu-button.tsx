"use client";

import { useSidebarDrawer } from "@/components/layout/sidebar-drawer-provider";

export function MobileMenuButton() {
  const { toggle } = useSidebarDrawer();

  return (
    <button
      type="button"
      aria-label="Mở menu"
      onClick={toggle}
      className="flex h-10 w-10 shrink-0 items-center justify-center text-text md:hidden"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}
