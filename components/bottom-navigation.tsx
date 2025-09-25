"use client";

import { BookIcon, HomeIcon, UserCogIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dock, DockIcon, DockItem, DockLabel } from "./dock";

const menuItems = [
  {
    name: "Home",
    url: "/dashboard",
    icon: HomeIcon,
  },
  {
    name: "Disciples",
    url: "/disciples",
    icon: UsersIcon,
  },
  {
    name: "Reports",
    url: "/cell-reports",
    icon: BookIcon,
  },
  {
    name: "My Profile",
    url: "/profile",
    icon: UserCogIcon,
  },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <Dock>
      {menuItems.map((menu) => (
        <DockItem key={menu.url} asChild active={pathname.startsWith(menu.url)}>
          <Link href={menu.url}>
            <DockIcon>
              <menu.icon />
            </DockIcon>
            <DockLabel>{menu.name}</DockLabel>
          </Link>
        </DockItem>
      ))}
    </Dock>
  );
}
