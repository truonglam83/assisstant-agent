"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Link tự biết mình có đang active không (so với URL hiện tại), để tô style
 * khác nhau — dùng cho cả mục Sidebar lẫn tab Chat/Rule trong trang agent.
 */
export function NavLink({
  href,
  exact = false,
  className = "",
  activeClassName,
  inactiveClassName,
  children,
}: {
  href: string;
  exact?: boolean;
  className?: string;
  activeClassName: string;
  inactiveClassName: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`${className} ${isActive ? activeClassName : inactiveClassName}`}
    >
      {children}
    </Link>
  );
}
