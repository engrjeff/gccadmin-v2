"use client";

import {
  ListIcon,
  MoreHorizontalIcon,
  PencilIcon,
  RotateCcwIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Disciple } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DiscipleChangeStatusDialog } from "./disciple-change-status-dialog";
import { DiscipleDeleteDialog } from "./disciple-delete-dialog";

type RowAction = "edit" | "delete" | "change-status";

export function DiscipleRowActions({ disciple }: { disciple: Disciple }) {
  const [action, setAction] = useState<RowAction>();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="iconSm" variant="ghost" aria-label="Disciple actions">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/disciples/${disciple.id}`}>
              <ListIcon />
              <span>Details</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAction("edit")}>
            <PencilIcon />
            Disciples
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setAction("change-status")}>
            <RotateCcwIcon />
            {disciple.isActive ? "Make Inactive" : "Make Active"}
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

      <DiscipleDeleteDialog
        discipleId={disciple.id}
        discipleName={disciple.name}
        open={action === "delete"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined);
          }
        }}
      />

      <DiscipleChangeStatusDialog
        discipleId={disciple.id}
        discipleName={disciple.name}
        isActive={disciple.isActive}
        open={action === "change-status"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined);
          }
        }}
      />
    </>
  );
}
