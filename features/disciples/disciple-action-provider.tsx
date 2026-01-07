"use client";

import {
  BookIcon,
  HomeIcon,
  ListIcon,
  PencilIcon,
  RotateCcwIcon,
  TrashIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import type { Disciple } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
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

type RowAction = "edit" | "delete" | "change-status" | "promote";

interface DiscipleActionContextState {
  action: RowAction | undefined;
  selectedDisciple: Disciple | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDisciple: React.Dispatch<React.SetStateAction<Disciple | null>>;
  handleAction: (action: RowAction) => void;
  resetState: VoidFunction;
}

const DiscipleActionContext =
  React.createContext<DiscipleActionContextState | null>(null);

export function DiscipleActionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<RowAction>();
  const [disciple, setSelectedDisciple] = useState<Disciple | null>(null);

  const handleAction = (action: RowAction) => {
    setAction(action);
    setOpen(false);
  };

  const resetState = () => {
    setAction(undefined);
    setSelectedDisciple(null);
    setOpen(false);
  };

  return (
    <DiscipleActionContext.Provider
      value={{
        action,
        selectedDisciple: disciple,
        open,
        handleAction,
        resetState,
        setOpen,
        setSelectedDisciple,
      }}
    >
      {children}
      <Drawer
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            setSelectedDisciple(null);
          }
        }}
      >
        {disciple ? (
          <DrawerContent>
            <DrawerHeader className="!text-left border-b">
              <DrawerTitle className="text-sm">{disciple?.name}</DrawerTitle>
              <DrawerDescription>Pick an action to do.</DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col gap-1 p-2 py-2">
              <Button
                size="lg"
                variant="ghost"
                className="w-full justify-start"
                asChild
              >
                <Link href={`/disciples/${disciple?.id}`}>
                  <ListIcon /> View Details
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="w-full justify-start"
                asChild
              >
                <Link href={`/disciples/${disciple?.id}?tab=lessons-taken`}>
                  <BookIcon /> Lessons Taken
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="w-full justify-start"
                asChild
              >
                <Link
                  href={`/disciples/${disciple?.id}?tab=attended-cellgroups`}
                >
                  <HomeIcon /> Attended Cell Groups
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="w-full justify-start"
                asChild
              >
                <Link href={`/disciples/${disciple?.id}?tab=handled-disciples`}>
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
              {disciple?.isPrimary ? null : (
                <>
                  <Button
                    size="lg"
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleAction("change-status")}
                  >
                    <RotateCcwIcon />
                    {disciple?.isActive ? "Make Inactive" : "Make Active"}
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
        ) : null}
      </Drawer>

      {disciple ? (
        <>
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
                <SheetDescription>
                  Make sure to save your changes.
                </SheetDescription>
              </SheetHeader>
              <DiscipleEditForm
                disciple={disciple}
                onAfterSave={() => resetState()}
              />
            </SheetContent>
          </Sheet>
        </>
      ) : null}
    </DiscipleActionContext.Provider>
  );
}

export function useDiscipleAction() {
  const context = React.useContext(DiscipleActionContext);

  if (!context)
    throw new Error(
      `useDiscipleAction must be used inside a <DiscipleActionProvider />`,
    );

  return context;
}
