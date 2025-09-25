import type { ReactNode } from "react";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { BottomNavigation } from "@/components/bottom-navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

function UserPagesLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 60)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="sidebar" />
      <SidebarInset className="overflow-hidden max-h-screen pb-16 sm:pb-0">
        <AppHeader />
        <div className="flex-1 max-h-[100%-48px] overflow-y-auto">
          <div className="container max-w-6xl mx-auto h-full">{children}</div>
        </div>
        <BottomNavigation />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default UserPagesLayout;
