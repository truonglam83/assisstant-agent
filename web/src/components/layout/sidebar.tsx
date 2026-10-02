import { auth, signOut } from "@/auth";
import { agentsApi } from "@/lib/api/agents";
import { NavLink } from "@/components/ui/nav-link";
import { SidebarAgentsList } from "@/components/layout/sidebar-agents-list";
import { SidebarCloseButton } from "@/components/layout/sidebar-close-button";

const navIcon = {
  chat: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
    </svg>
  ),
  mail: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
  cost: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2v20M17 5.5c-1-1-2.6-1.5-5-1.5-3 0-5 1.3-5 3.5s2 3 5 3 5 .8 5 3-2 3.5-5 3.5c-2.4 0-4-.5-5-1.5" />
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  ),
};

const navActive = "border border-border bg-white font-semibold text-text";
const navInactive = "border border-transparent font-normal text-text";

export async function Sidebar() {
  const session = await auth();
  const name = session?.user?.name ?? session?.user?.email ?? "Bạn";
  const initial = name.charAt(0).toUpperCase();
  const agents = await agentsApi.list();

  return (
    <nav
      aria-label="Điều hướng chính"
      className="flex h-full w-[260px] shrink-0 flex-col gap-1 overflow-y-auto border-r border-border bg-sidebar p-3.5"
    >
      <div className="flex items-center gap-2.5 px-2 pb-4.5 pt-1">
        <div className="flex h-[40px] w-[40px] items-center justify-center rounded-lg bg-accent font-serif text-[17px] font-semibold text-white">
          2A
        </div>
        <div className="flex-1 font-serif text-xl font-semibold">Assistant Agent</div>
        <SidebarCloseButton />
      </div>

      <NavLink
        href="/"
        exact
        className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[15px] ${navInactive}`}
        activeClassName={navActive}
        inactiveClassName={navInactive}
      >
        {navIcon.chat}
        Chat chung
      </NavLink>

      <SidebarAgentsList initialAgents={agents} />

      <div className="grow" />

      <NavLink
        href="/costs"
        className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[15px]"
        activeClassName={navActive}
        inactiveClassName={navInactive}
      >
        {navIcon.cost}
        <span className="grow">Chi phí</span>
      </NavLink>
      <NavLink
        href="/settings"
        className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[15px]"
        activeClassName={navActive}
        inactiveClassName={navInactive}
      >
        {navIcon.settings}
        Cài đặt
      </NavLink>

      <div className="mt-2 flex items-center gap-2.5 border-t border-border px-3 pb-1 pt-3.5">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-border-input text-[13px] font-semibold">
          {initial}
        </div>
        <div className="min-w-0 flex-1 truncate text-sm">{name}</div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="text-xs text-text-muted underline underline-offset-2"
          >
            Đăng xuất
          </button>
        </form>
      </div>
    </nav>
  );
}
