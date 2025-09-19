"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FaviconImage } from "./favicon-image";

const GCC_LINKS = [
  {
    label: "GCC Spotify",
    link: "https://open.spotify.com/show/48ijgGXWkrQI9CYqnXzgHB?si=6366e95881d645b9",
  },
  {
    label: "GCC Facebook",
    link: "https://www.facebook.com/gccmorong",
  },
  {
    label: "GCC YouTube",
    link: "https://www.youtube.com/@gracecitychurch2245",
  },
];

export function NavGCCLinks() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>GCC Links</SidebarGroupLabel>
      <SidebarMenu>
        {GCC_LINKS.map((item) => (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton asChild>
              <a target="_blank" rel="noopener noreferrer" href={item.link}>
                <FaviconImage url={item.link} size={16} />
                <span>{item.label}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
