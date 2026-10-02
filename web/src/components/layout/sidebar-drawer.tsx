"use client";

import type { ReactNode } from "react";
import { useSidebarDrawer } from "@/components/layout/sidebar-drawer-provider";

/**
 * Bọc <Sidebar/> (Server Component, truyền vào qua children). Dưới `md`:
 * Sidebar là menu trượt cố định (fixed) + lớp phủ mờ, ẩn theo mặc định.
 * Từ `md` trở lên: quay về sidebar tĩnh 260px như cũ, luôn hiện.
 */
export function SidebarDrawer({ children }: { children: ReactNode }) {
  const { isOpen, close } = useSidebarDrawer();

  return (
    <>
      {isOpen ? (
        <div
          aria-hidden="true"
          onClick={close}
          className="fixed inset-0 z-40 bg-text/45 md:hidden"
        />
      ) : null}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[260px] shrink-0 transition-transform duration-200 md:static md:z-auto md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {children}
      </div>
    </>
  );
}
