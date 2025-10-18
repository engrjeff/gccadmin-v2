"use client";

import { LockIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { isLocked } from "@/lib/utils";
import { CellReportForm } from "./cell-report-form";

export function CellReportCreateFormModal() {
  const [open, setOpen] = useState(false);

  const locked = isLocked();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" disabled={locked}>
          {locked ? <LockIcon /> : <PlusIcon />} Create Report
        </Button>
      </SheetTrigger>
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
