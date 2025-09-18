"use client";

import {
  BookOpenIcon,
  GalleryVerticalEnd,
  Grid2X2Icon,
  NotebookIcon,
  ShieldCheckIcon,
  ShieldIcon,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type * as React from "react";
import { NavCellGroup } from "@/components/nav-cellgroup";
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
import { app } from "@/lib/config";
import { NavAdmin } from "./nav-admin";
import { NavProcess } from "./nav-process";

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
  navAdmin: [
    {
      name: "Leaders",
      url: "/leaders",
      icon: ShieldIcon,
    },
  ],
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
      // quickActions: [
      //   {
      //     label: "Add Disciple",
      //     url: "/disciples/new",
      //     icon: PlusIcon,
      //   },
      // ],
    },
    {
      name: "Cell Reports",
      url: "/cell-reports",
      icon: NotebookIcon,
      // quickActions: [
      //   {
      //     label: "Create Report",
      //     url: "/cell-reports/new",
      //     icon: PlusIcon,
      //   },
      // ],
    },
  ],
  navProcess: [
    {
      name: "Resources",
      url: "/resources",
      icon: BookOpenIcon,
    },
    {
      name: "Leadership",
      url: "/leadership",
      icon: ShieldCheckIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" className="flex items-center">
                <Image
                  unoptimized
                  src="/gcc-logo.svg"
                  alt={app.title}
                  width={40}
                  height={40}
                  className="-mt-1"
                />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{data.app.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {data.app.subtitle}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavCellGroup menuItems={data.navCellGroup} />
        <NavAdmin menuItems={data.navAdmin} />
        <NavProcess menuItems={data.navProcess} />
      </SidebarContent>
      <SidebarFooter>
        <p className="text-xs text-muted-foreground">
          Made with ♥️ by{" "}
          <a
            href="http://jeffsegovia.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline hover:text-foreground"
          >
            Jeff Segovia
          </a>
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
