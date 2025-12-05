"use client";

import { MoreHorizontalIcon, PencilIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SoulWinningReportType } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WinAndConsoDeleteDialog } from "./win-and-conso-delete-dialog";

type RowAction = "edit" | "delete" | "change-status";

interface WinAndConsoRowActionsProps {
  type: SoulWinningReportType;
  reportId: string;
}

export function WinAndConsoRowActions({
  type,
  reportId,
}: WinAndConsoRowActionsProps) {
  const [action, setAction] = useState<RowAction>();

  return (
    <div className="flex items-center justify-center gap-1">
      {type === SoulWinningReportType.SOUL_WINNING ? (
        <Button
          type="button"
          size="sm"
          variant="link"
          className="text-blue-500"
        >
          <Link
            href={`/soul-winning/new-believers?soulWinningReportId=${reportId}`}
          >
            Track
          </Link>
        </Button>
      ) : null}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="iconSm" variant="ghost" aria-label="Actions">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled onClick={() => setAction("edit")}>
            <PencilIcon />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setAction("delete")}
          >
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <WinAndConsoDeleteDialog
        reportId={reportId}
        type={type}
        open={action === "delete"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined);
          }
        }}
      />
    </div>
  );
}
