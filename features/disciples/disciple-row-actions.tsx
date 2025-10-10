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
  DrawerHeader,
  DrawerTitle,
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
import { useIsMobile } from "@/hooks/use-mobile";
import { useDiscipleAction } from "./disciple-action-provider";
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
          <DropdownMenuItem asChild>
            <Link href={`/disciples/${disciple.id}?tab=lessons-taken`}>
              <BookIcon /> <span>Lessons Taken</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/disciples/${disciple.id}?tab=attended-cellgroups`}>
              <HomeIcon /> <span>Attended Cell Groups</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/disciples/${disciple.id}?tab=handled-disciples`}>
              <UsersIcon /> <span>Handled Disciples</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setAction("edit")}>
            <PencilIcon />
            Update
          </DropdownMenuItem>
          {disciple.isPrimary ? null : (
            <>
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
            </>
          )}
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

export function DiscipleActionButton({ disciple }: { disciple: Disciple }) {
  const { setOpen, setSelectedDisciple } = useDiscipleAction();

  return (
    <Button
      size="iconSm"
      variant="ghost"
      aria-label="Disciple actions"
      onClick={() => {
        setOpen(true);
        setSelectedDisciple(disciple);
      }}
    >
      <MoreHorizontalIcon />
    </Button>
  );
}

export function DiscipleRowMobileActions() {
  const {
    action,
    open,
    handleAction,
    selectedDisciple: disciple,
    setSelectedDisciple,
    setOpen,
    resetState,
  } = useDiscipleAction();

  const isMobile = useIsMobile();

  if (!isMobile) return null;

  if (!disciple) return null;

  return (
    <>
      <Drawer
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedDisciple(null);
          }
          setOpen(isOpen);
        }}
      >
        <DrawerContent>
          <DrawerHeader className="!text-left border-b">
            <DrawerTitle className="text-sm">{disciple.name}</DrawerTitle>
            <DrawerDescription>Pick an action to do.</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-1 p-2 py-2">
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

          <div className="flex flex-col gap-1 px-2 py-2">
            <Button
              size="lg"
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleAction("edit")}
            >
              <PencilIcon />
              Update
            </Button>
            {disciple.isPrimary ? null : (
              <>
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleAction("change-status")}
                >
                  <RotateCcwIcon />
                  {disciple.isActive ? "Make Inactive" : "Make Active"}
                </Button>
                <Button
                  size="lg"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  variant="ghost"
                  onClick={() => handleAction("delete")}
                >
                  <TrashIcon />
                  Delete
                </Button>
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      <DiscipleDeleteDialog
        discipleId={disciple.id}
        discipleName={disciple.name}
        open={action === "delete"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            resetState();
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
            resetState();
          }
        }}
      />

      <Sheet
        open={action === "edit"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            resetState();
          }
        }}
      >
        <SheetContent
          side="right"
          className="inset-y-2 right-2 flex h-auto w-[95%] flex-col gap-0 overflow-y-hidden rounded-lg border bg-background p-0 focus-visible:outline-none sm:max-w-lg"
        >
          <SheetHeader className="space-y-1 border-b p-4 text-left">
            <SheetTitle>Update Disciple</SheetTitle>
            <SheetDescription>Make sure to save your changes.</SheetDescription>
          </SheetHeader>
          <DiscipleEditForm
            disciple={disciple}
            onAfterSave={() => resetState()}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
