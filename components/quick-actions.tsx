"use client";

import { isSunday } from "date-fns";
import {
  ChevronDownIcon,
  LockIcon,
  PlusIcon,
  UserPlusIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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

type QuickActionType = "add-disciple" | "create-cell-report";

export function QuickActions() {
  const [open, setOpen] = useState(false);

  const [action, setAction] = useState<QuickActionType>();

  const lockReporting = isSunday(new Date());

  function reset() {
    setAction(undefined);
    setOpen(false);
  }

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="hidden sm:inline-flex">
            <PlusIcon /> Create <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setAction("add-disciple")}>
            <UserPlusIcon /> Add Disciple
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={lockReporting}
            onClick={() => setAction("create-cell-report")}
          >
            {lockReporting ? <LockIcon /> : <PlusIcon />} Create Cell Report
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
