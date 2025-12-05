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
import { NewBelieverDeleteDialog } from "./new-believer-delete-dialog";

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
            Make Disciple
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
    </>
  );
}
