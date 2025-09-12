"use client";

import {
  GalleryVerticalEnd,
  Grid2X2Icon,
  NotebookIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import type * as React from "react";
import { NavCellGroup } from "@/components/nav-cellgroup";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Jeff Segovia",
    email: "jeff@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  app: {
    name: "GCC Admin",
    logo: GalleryVerticalEnd,
    subtitle: "Grace City Church",
  },
  navCellGroup: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: Grid2X2Icon,
    },
    {
      name: "Disciples",
      url: "/disciples",
      icon: UsersIcon,
      quickActions: [
        {
          label: "Add Disciple",
          url: "/disciples/new",
          icon: PlusIcon,
        },
      ],
    },
    {
      name: "Cell Reports",
      url: "/cell-reports",
      icon: NotebookIcon,
      quickActions: [
        {
          label: "Create Report",
          url: "/cell-reports/new",
          icon: PlusIcon,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">{data.app.name}</span>
                  <span className="">{data.app.subtitle}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavCellGroup menuItems={data.navCellGroup} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
