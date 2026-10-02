import { notFound } from "next/navigation";
import { agentsApi } from "@/lib/api/agents";
import { NavLink } from "@/components/ui/nav-link";
import { EditAgentButton } from "@/components/agents/edit-agent-button";
import { MobileMenuButton } from "@/components/layout/mobile-menu-button";
import { TAB_ACTIVE_CLASS, TAB_INACTIVE_CLASS } from "@/lib/tab-styles";

export default async function AgentLayout(props: LayoutProps<"/agents/[slug]">) {
  const { slug } = await props.params;
  const agent = await agentsApi.getBySlug(slug);
  if (!agent) notFound();

  return (
    <>
      {/*
        Dưới `md`: 2 hàng (giống docs/ui-mockup.html màn "Điện thoại") — hàng 1
        menu + tên + nút sửa, hàng 2 tab full width (4 tab, chữ nhỏ hơn để vừa).
        Từ `md`: 1 hàng như cũ.
      */}
      <header className="flex shrink-0 flex-col gap-2.5 border-b border-border px-3 pb-2.5 pt-3 md:h-[68px] md:flex-row md:items-center md:gap-6 md:px-8 md:py-0">
        <div className="flex items-center gap-1.5 md:gap-2.5">
          <MobileMenuButton />
          <div className="hidden h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] bg-accent-soft text-accent md:flex">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
          </div>
          <h1 className="flex-1 truncate font-serif text-lg font-semibold text-text md:flex-none md:text-[22px]">
            {agent.name}
          </h1>
          <div className="md:hidden">
            <EditAgentButton agent={agent} />
          </div>
        </div>

        <div
          role="tablist"
          className="grid grid-cols-4 gap-1 rounded-[10px] bg-tab-bg p-1 md:flex md:w-auto"
        >
          <NavLink
            href={`/agents/${slug}`}
            exact
            className="rounded-[7px] px-2 py-1.5 text-center text-xs md:px-4 md:text-sm"
            activeClassName={TAB_ACTIVE_CLASS}
            inactiveClassName={TAB_INACTIVE_CLASS}
          >
            Chat
          </NavLink>
          <NavLink
            href={`/agents/${slug}/rules`}
            className="rounded-[7px] px-2 py-1.5 text-center text-xs md:px-4 md:text-sm"
            activeClassName={TAB_ACTIVE_CLASS}
            inactiveClassName={TAB_INACTIVE_CLASS}
          >
            Rule
          </NavLink>
          <NavLink
            href={`/agents/${slug}/schedules`}
            className="rounded-[7px] px-2 py-1.5 text-center text-xs md:px-4 md:text-sm"
            activeClassName={TAB_ACTIVE_CLASS}
            inactiveClassName={TAB_INACTIVE_CLASS}
          >
            Lịch
          </NavLink>
          <NavLink
            href={`/agents/${slug}/memories`}
            className="rounded-[7px] px-2 py-1.5 text-center text-xs md:px-4 md:text-sm"
            activeClassName={TAB_ACTIVE_CLASS}
            inactiveClassName={TAB_INACTIVE_CLASS}
          >
            Trí nhớ
          </NavLink>
        </div>

        <div className="hidden md:block md:grow" />

        <div className="hidden md:block">
          <EditAgentButton agent={agent} />
        </div>
      </header>

      {props.children}
    </>
  );
}
