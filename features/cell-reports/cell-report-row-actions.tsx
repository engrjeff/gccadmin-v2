"use client";

import { EyeIcon, MoreHorizontalIcon, PencilIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
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
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { CellReportRecord } from "@/types/globals";
import { CellReportDetails } from "./cell-report-details";
import { CellReportEditForm } from "./cell-report-edit-form";
import { GeneratePDFButton, GeneratePDFButtonWide } from "./cell-report-pdf";

type RowAction = "view" | "edit" | "generate-pdf";

export function CellReportRowActions({
  cellReport,
}: {
  cellReport: CellReportRecord;
}) {
  const [action, setAction] = useState<RowAction>();

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="link"
          size="sm"
          className="text-blue-500"
          onClick={() => setAction("view")}
        >
          View
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="iconSm" variant="ghost" aria-label="Leader actions">
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setAction("edit")}>
              <PencilIcon />
              Edit Details
            </DropdownMenuItem>
            <GeneratePDFButton cellReport={cellReport} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Sheet
        open={action === "view"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined);
          }
        }}
      >
        <SheetContent
          side="right"
          className="inset-y-2 right-2 flex h-auto w-[95%] flex-col gap-0 overflow-y-hidden rounded-lg border bg-background p-0 focus-visible:outline-none sm:max-w-lg"
        >
          <SheetHeader className="border-b p-4 text-left">
            <SheetTitle>Cell Report Details</SheetTitle>
            <div className="flex items-center justify-between">
              <SheetDescription>
                Information about this cell report.
              </SheetDescription>
              <Badge variant={cellReport.type}>{cellReport.type}</Badge>
            </div>
          </SheetHeader>

          <div className="max-h-[calc(100%-69px)] flex-1 overflow-y-auto pt-1 pb-4">
            <CellReportDetails cellReport={cellReport} />
          </div>

          <div className="mt-auto flex justify-end gap-3 border-t p-4 text-right">
            <SheetClose asChild>
              <Button type="button" variant="outline" className="bg-muted/30">
                Close
              </Button>
            </SheetClose>
            <GeneratePDFButtonWide cellReport={cellReport} />
          </div>
        </SheetContent>
      </Sheet>

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
            <SheetTitle>Update Cell Report Details</SheetTitle>
            <SheetDescription>Make sure to save your changes.</SheetDescription>
          </SheetHeader>
          <CellReportEditForm
            cellReport={cellReport}
            onAfterSave={() => setAction(undefined)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}

export function CellReportMobileActions({
  cellReport,
}: {
  cellReport: CellReportRecord;
}) {
  const [action, setAction] = useState<RowAction>();

  const [open, setOpen] = useState(false);

  function reset() {
    setAction(undefined);
  }

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button size="iconSm" variant="ghost" aria-label="Disciple actions">
            <MoreHorizontalIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="!text-left border-b">
            <DrawerTitle className="text-sm">Cell Report Actions</DrawerTitle>
            <DrawerDescription>Pick an action to do.</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-1 p-2 py-2">
            <Button
              size="lg"
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setAction("view")}
            >
              <EyeIcon />
              View
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setAction("edit")}
            >
              <PencilIcon />
              Edit Details
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      <Sheet
        open={action === "view"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            reset();
          }
        }}
      >
        <SheetContent
          side="right"
          className="inset-y-2 right-2 flex h-auto w-[95%] flex-col gap-0 overflow-y-hidden rounded-lg border bg-background p-0 focus-visible:outline-none sm:max-w-lg"
        >
          <SheetHeader className="border-b p-4 text-left">
            <SheetTitle>Cell Report Details</SheetTitle>
            <div className="flex items-center justify-between">
              <SheetDescription>
                Information about this cell report.
              </SheetDescription>
              <Badge variant={cellReport.type}>{cellReport.type}</Badge>
            </div>
          </SheetHeader>

          <div className="max-h-[calc(100%-69px)] flex-1 overflow-y-auto pt-1 pb-4">
            <CellReportDetails cellReport={cellReport} />
          </div>

          <div className="mt-auto flex justify-end gap-3 border-t p-4 text-right">
            <SheetClose asChild>
              <Button type="button" variant="outline" className="bg-muted/30">
                Close
              </Button>
            </SheetClose>
            <GeneratePDFButtonWide cellReport={cellReport} />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet
        open={action === "edit"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            reset();
          }
        }}
      >
        <SheetContent
          side="right"
          className="inset-y-2 right-2 flex h-auto w-[95%] flex-col gap-0 overflow-y-hidden rounded-lg border bg-background p-0 focus-visible:outline-none sm:max-w-lg"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <SheetHeader className="space-y-1 border-b p-4 text-left">
            <SheetTitle>Update Cell Report Details</SheetTitle>
            <SheetDescription>Make sure to save your changes.</SheetDescription>
          </SheetHeader>
          <CellReportEditForm
            cellReport={cellReport}
            onAfterSave={() => reset()}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
