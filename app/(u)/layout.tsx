import type { ReactNode } from "react";
import { Announcement } from "@/components/announcement";
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
      <SidebarInset className="max-h-screen overflow-hidden pb-16 sm:pb-0">
        <Announcement />
        <AppHeader />
        <div className="max-h-[100%-48px] flex-1 overflow-y-auto">
          <div className="container mx-auto h-full max-w-6xl">{children}</div>
        </div>
        <BottomNavigation />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default UserPagesLayout;
