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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DiscipleChangeStatusDialog } from "./disciple-change-status-dialog";
import { DiscipleDeleteDialog } from "./disciple-delete-dialog";
import { DiscipleEditForm } from "./disciple-edit-form";

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
            Update
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

      <Sheet
        open={action === "edit"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined);
          }
        }}
      >
        <SheetContent
          side="right"
          className="inset-y-2 right-2 flex h-auto w-[95%] flex-col gap-0 overflow-y-hidden rounded-lg border bg-background p-0 focus-visible:outline-none sm:max-w-lg"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <SheetHeader className="space-y-1 border-b p-4 text-left">
            <SheetTitle>Update Disciple</SheetTitle>
            <SheetDescription>Make sure to save your changes.</SheetDescription>
          </SheetHeader>
          <DiscipleEditForm
            disciple={disciple}
            onAfterSave={() => setAction(undefined)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
