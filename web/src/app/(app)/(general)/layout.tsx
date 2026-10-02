import { NavLink } from "@/components/ui/nav-link";
import { MobileMenuButton } from "@/components/layout/mobile-menu-button";
import { TAB_ACTIVE_CLASS, TAB_INACTIVE_CLASS } from "@/lib/tab-styles";

/**
 * Layout cho Chat chung: gộp 2 route "/" (chat) và "/memories" (hồ sơ chung —
 * ghi nhớ KHÔNG thuộc agent nào, mọi agent đều đọc, xem src/lib/mock/memories.ts).
 * Ghi nhớ riêng của từng agent nằm ở tab "Trí nhớ" trong agents/[slug], không
 * nằm ở đây.
 */
export default function GeneralLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header className="flex shrink-0 flex-col gap-2.5 border-b border-border px-3 pb-2.5 pt-3 md:h-[68px] md:flex-row md:items-center md:gap-6 md:px-8 md:py-0">
        <div className="flex items-center gap-1.5 md:gap-2.5">
          <MobileMenuButton />
          <h1 className="flex-1 truncate font-serif text-lg font-semibold text-text md:flex-none md:text-[22px]">
            Chat chung
          </h1>
        </div>

        <div
          role="tablist"
          className="grid grid-cols-2 gap-1 rounded-[10px] bg-tab-bg p-1 md:flex md:w-auto"
        >
          <NavLink
            href="/"
            exact
            className="rounded-[7px] px-4 py-1.5 text-center text-sm"
            activeClassName={TAB_ACTIVE_CLASS}
            inactiveClassName={TAB_INACTIVE_CLASS}
          >
            Chat
          </NavLink>
          <NavLink
            href="/memories"
            className="rounded-[7px] px-4 py-1.5 text-center text-sm"
            activeClassName={TAB_ACTIVE_CLASS}
            inactiveClassName={TAB_INACTIVE_CLASS}
          >
            Trí nhớ
          </NavLink>
        </div>

        <div className="hidden md:block md:grow" />
      </header>

      {children}
    </>
  );
}
