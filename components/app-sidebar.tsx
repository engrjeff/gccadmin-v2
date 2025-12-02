"use client";

import {
  BookIcon,
  BookOpenIcon,
  CircleUserIcon,
  GalleryVerticalEnd,
  Grid2X2Icon,
  LeafIcon,
  LibraryIcon,
  ListIcon,
  ShieldCheckIcon,
  ShieldIcon,
  UserCogIcon,
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
import { NavSettings } from "./nav-settings";

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
    {
      name: "Users",
      url: "/users",
      icon: CircleUserIcon,
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
      name: "Soul Winning",
      url: "/soul-winning",
      icon: LeafIcon,
    },
    {
      name: "Cell Reports",
      url: "/cell-reports",
      icon: BookIcon,
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
      name: "CG Lessons",
      url: "/resources",
      icon: BookOpenIcon,
    },
    {
      name: "Growth Process System",
      url: "/gps",
      icon: ShieldCheckIcon,
    },
    {
      name: "Attendance",
      url: "/attendance",
      icon: ListIcon,
    },
    {
      name: "GCC Resources",
      url: "/gcc-resources",
      icon: LibraryIcon,
    },
  ],
  navSettings: [
    {
      name: "My Profile",
      url: "/profile",
      icon: UserCogIcon,
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
                  className="-mt-1 -ml-2"
                />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{data.app.name}</span>
                  <span className="text-muted-foreground text-xs">
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
        <NavSettings menuItems={data.navSettings} />
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <p className="text-muted-foreground text-xs">
          Made with ♥️ by{" "}
          <a
            href="http://jeffsegovia.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:text-foreground hover:underline"
          >
            Jeff Segovia
          </a>
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
