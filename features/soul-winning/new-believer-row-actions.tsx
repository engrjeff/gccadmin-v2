"use client";

import {
  ArrowUpRightIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import type { NewBeliever } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { NewBelieverDeleteDialog } from "./new-believer-delete-dialog";
import { NewBelieverEditForm } from "./new-believer-edit-form";

type RowAction = "edit" | "delete" | "make-disciple";

interface ExtendedNewBeliever extends NewBeliever {
  networkLeader: { id: string; name: string } | null;
  handledBy: { id: string; name: string } | null;
  soulWinningReports: {
    lessonId: string;
  }[];
}

interface NewBelieverRowActionsProps {
  newBeliever: ExtendedNewBeliever;
}

export function NewBelieverRowActions({
  newBeliever,
}: NewBelieverRowActionsProps) {
  const [action, setAction] = useState<RowAction>();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="iconSm" variant="ghost" aria-label="Actions">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setAction("edit")}>
            <PencilIcon />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem disabled onClick={() => setAction("make-disciple")}>
            <ArrowUpRightIcon />
            Promote as Disciple
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

      <NewBelieverDeleteDialog
        id={newBeliever.id}
        name={newBeliever.name}
        open={action === "delete"}
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
            <SheetTitle>Update New Believer</SheetTitle>
            <SheetDescription>Make sure to save your changes.</SheetDescription>
          </SheetHeader>
          <NewBelieverEditForm
            newBeliever={newBeliever}
            onAfterSave={() => setAction(undefined)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
