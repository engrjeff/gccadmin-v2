"use client";

import {
  ChevronDownIcon,
  InfoIcon,
  PlusIcon,
  UserPlusIcon,
} from "lucide-react";
import { useState } from "react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CellReportForm } from "@/features/cell-reports/cell-report-form";
import { DiscipleForm } from "@/features/disciples/disciple-form";
import { useIsMobile } from "@/hooks/use-mobile";

type QuickActionType = "add-disciple" | "create-cell-report";

export function QuickActions() {
  const isMobile = useIsMobile();

  const [open, setOpen] = useState(false);

  const [action, setAction] = useState<QuickActionType>();

  function reset() {
    setAction(undefined);
    setOpen(false);
  }

  if (isMobile)
    return (
      <>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button size="sm">
              <PlusIcon /> Create <ChevronDownIcon />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="!text-left border-b">
              <DrawerTitle className="text-sm">Create Actions</DrawerTitle>
              <DrawerDescription>Pick an action to do.</DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col gap-1 px-0.5 py-2">
              <Button
                size="lg"
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setAction("add-disciple")}
              >
                <UserPlusIcon /> Add a Disciple
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setAction("create-cell-report")}
              >
                <PlusIcon /> Create Cell Report
              </Button>
            </div>
            <DrawerFooter className="flex-row gap-2 border-t text-muted-foreground text-xs">
              <InfoIcon className="size-3" />
              <p>
                You can also add Disciple and create Cell Report in their
                respective pages.
              </p>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <AddDiscipleForm
          open={action === "add-disciple"}
          setOpen={(isOpen) => {
            if (!isOpen) {
              reset();
            }
          }}
        />
        <CreateCellReportForm
          open={action === "create-cell-report"}
          setOpen={(isOpen) => {
            if (!isOpen) {
              reset();
            }
          }}
        />
      </>
    );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm">
            <PlusIcon /> Create <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setAction("add-disciple")}>
            <UserPlusIcon /> Add a Disciple
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAction("create-cell-report")}>
            <PlusIcon /> Create Cell Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AddDiscipleForm
        open={action === "add-disciple"}
        setOpen={(isOpen) => {
          if (!isOpen) {
            reset();
          }
        }}
      />
      <CreateCellReportForm
        open={action === "create-cell-report"}
        setOpen={(isOpen) => {
          if (!isOpen) {
            reset();
          }
        }}
      />
    </>
  );
}

export function AddDiscipleForm({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="inset-y-2 right-2 flex h-auto w-[95%] flex-col gap-0 overflow-y-hidden rounded-lg border bg-background p-0 focus-visible:outline-none sm:max-w-lg"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="border-b p-4 text-left">
          <SheetTitle>Add Disciple</SheetTitle>
          <SheetDescription>Fill in the details below.</SheetDescription>
        </SheetHeader>
        <DiscipleForm onAfterSave={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

export function CreateCellReportForm({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="inset-y-2 right-2 flex h-auto w-[95%] flex-col gap-0 overflow-y-hidden rounded-lg border bg-background p-0 focus-visible:outline-none sm:max-w-lg"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="space-y-1 border-b p-4 text-left">
          <SheetTitle>Create Cell Report</SheetTitle>
          <SheetDescription>Fill in the details below.</SheetDescription>
        </SheetHeader>
        <CellReportForm onAfterSave={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
