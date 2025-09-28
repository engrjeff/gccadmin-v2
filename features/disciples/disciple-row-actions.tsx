"use client";

import {
  BookIcon,
  HomeIcon,
  ListIcon,
  MoreHorizontalIcon,
  PencilIcon,
  RotateCcwIcon,
  TrashIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Disciple } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
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

export function DiscipleRowMobileActions({ disciple }: { disciple: Disciple }) {
  const [action, setAction] = useState<RowAction>();

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button size="iconSm" variant="ghost" aria-label="Disciple actions">
            <MoreHorizontalIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="!text-left border-b">
            <DrawerTitle className="text-sm">{disciple.name}</DrawerTitle>
            <DrawerDescription>Pick an action to do.</DrawerDescription>
          </DrawerHeader>
          <div className="p-2 py-2 flex flex-col gap-1">
            <Button
              size="lg"
              variant="ghost"
              className="w-full justify-start"
              asChild
            >
              <Link href={`/disciples/${disciple.id}`}>
                <ListIcon /> View Details
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="w-full justify-start"
              asChild
            >
              <Link href={`/disciples/${disciple.id}?tab=lessons-taken`}>
                <BookIcon /> Lessons Taken
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="w-full justify-start"
              asChild
            >
              <Link href={`/disciples/${disciple.id}?tab=attended-cellgroups`}>
                <HomeIcon /> Attended Cell Groups
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="w-full justify-start"
              asChild
            >
              <Link href={`/disciples/${disciple.id}?tab=handled-disciples`}>
                <UsersIcon /> Handled Disciples
              </Link>
            </Button>
          </div>

          <Separator />

          <div className="px-2 py-2 flex flex-col gap-1">
            <Button
              size="lg"
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setAction("edit")}
            >
              <PencilIcon />
              Update
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setAction("change-status")}
            >
              <RotateCcwIcon />
              {disciple.isActive ? "Make Inactive" : "Make Active"}
            </Button>
            <Button
              size="lg"
              className="w-full justify-start bg-destructive/10"
              variant="destructive"
              onClick={() => setAction("delete")}
            >
              <TrashIcon />
              Delete
            </Button>
          </div>
          <DrawerFooter className="border-t text-xs text-muted-foreground gap-2 flex-row">
            nn
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

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
