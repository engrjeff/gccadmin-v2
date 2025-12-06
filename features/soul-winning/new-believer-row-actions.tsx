"use client";

import {
  ArrowUpRightIcon,
  CheckIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import type { NewBeliever } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";
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
import { PromoteAsDiscipleForm } from "../disciples/promote-as-disciple-form";
import { CannotBePromotedAsDiscipleDialog } from "./cannnot-be-promoted-as-disciple-dialog";
import { NewBelieverDeleteDialog } from "./new-believer-delete-dialog";
import { NewBelieverEditForm } from "./new-believer-edit-form";

type RowAction = "edit" | "delete" | "promote-as-disciple";

interface ExtendedNewBeliever extends NewBeliever {
  networkLeader: { id: string; name: string } | null;
  handledBy: { id: string; name: string } | null;
  soulWinningReports: {
    lessonId: string;
  }[];
}

interface NewBelieverRowActionsProps {
  newBeliever: ExtendedNewBeliever;
  canBePromoted: boolean;
}

export function NewBelieverRowActions({
  newBeliever,
  canBePromoted,
}: NewBelieverRowActionsProps) {
  const [action, setAction] = useState<RowAction>();

  if (newBeliever.discipleProfileId)
    return (
      <Badge className="px-0 dark:bg-transparent" variant="ACTIVE">
        <CheckIcon /> Promoted
      </Badge>
    );

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
          <DropdownMenuItem onClick={() => setAction("promote-as-disciple")}>
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

      {/* promote as disciple */}
      <CannotBePromotedAsDiscipleDialog
        name={newBeliever.name}
        gender={newBeliever.gender}
        memberType={newBeliever.memberType}
        open={action === "promote-as-disciple" && !canBePromoted}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined);
          }
        }}
      />

      <Sheet
        open={action === "promote-as-disciple" && canBePromoted}
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
            <SheetTitle>Promote as Disciple</SheetTitle>
            <SheetDescription>Make sure to save your changes.</SheetDescription>
          </SheetHeader>
          <PromoteAsDiscipleForm
            initialValues={{
              newBelieverId: newBeliever.id,
              leaderId: newBeliever.networkLeaderId,
              name: newBeliever.name,
              gender: newBeliever.gender,
              memberType: newBeliever.memberType,
              address: newBeliever.address ?? "",
              handledById: newBeliever.handledById ?? undefined,
            }}
            onAfterSave={() => setAction(undefined)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
