import { SessionProvider } from "next-auth/react";
import { Sidebar } from "@/components/layout/sidebar";
import { AgentModalProvider } from "@/components/agents/agent-modal-provider";
import { SidebarDrawerProvider } from "@/components/layout/sidebar-drawer-provider";
import { SidebarDrawer } from "@/components/layout/sidebar-drawer";
import { ToastProvider } from "@/components/ui/toast-provider";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <SessionProvider>
      <ToastProvider>
        <AgentModalProvider>
          <SidebarDrawerProvider>
            <div className="flex h-screen bg-app-bg">
              <SidebarDrawer>
                <Sidebar />
              </SidebarDrawer>
              <main className="flex min-w-0 flex-1 flex-col">{children}</main>
            </div>
          </SidebarDrawerProvider>
        </AgentModalProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
