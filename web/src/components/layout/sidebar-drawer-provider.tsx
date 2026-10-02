"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

type SidebarDrawerContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const SidebarDrawerContext = createContext<SidebarDrawerContextValue | null>(null);

export function useSidebarDrawer(): SidebarDrawerContextValue {
  const ctx = useContext(SidebarDrawerContext);
  if (!ctx) {
    throw new Error("useSidebarDrawer phải được gọi bên trong <SidebarDrawerProvider>");
  }
  return ctx;
}

/** Trạng thái mở/đóng menu trượt trên điện thoại (Sidebar). Chỉ có tác dụng dưới breakpoint `md`. */
export function SidebarDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Chuyển trang thì tự đóng menu (đỡ phải tự bấm đóng trên điện thoại).
  // Cập nhật ngay trong lúc render (không dùng effect) theo đúng khuyến nghị
  // của React khi cần "reset state theo prop thay đổi" — tránh lỗi lint
  // react-hooks/set-state-in-effect.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  const value: SidebarDrawerContextValue = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };

  return (
    <SidebarDrawerContext.Provider value={value}>{children}</SidebarDrawerContext.Provider>
  );
}
