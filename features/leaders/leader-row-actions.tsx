"use client";

import {
  BookIcon,
  ListIcon,
  MoreHorizontalIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import type { Disciple } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LeaderRowActions({ leader }: { leader: Disciple }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="iconSm" variant="ghost" aria-label="Leader actions">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/leaders/${leader.id}`}>
            <ListIcon />
            <span>Details</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/disciples?leader=${leader.id}`}>
            <UsersIcon />
            <span>Disciples</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/cell-reports?leader=${leader.id}`}>
            <BookIcon />
            <span>Cell Reports</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
