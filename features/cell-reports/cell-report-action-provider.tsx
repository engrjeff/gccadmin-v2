"use client";

import { EyeIcon, MoreHorizontalIcon, PencilIcon } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
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
import { GeneratePDFButtonWide } from "./cell-report-pdf";

type RowAction = "view" | "edit" | "generate-pdf";

interface CellReportActionContextState {
  action: RowAction | undefined;
  selectedCellReport: CellReportRecord | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCellReport: React.Dispatch<
    React.SetStateAction<CellReportRecord | null>
  >;
  handleAction: (action: RowAction) => void;
  resetState: VoidFunction;
}

const CellReportActionContext =
  React.createContext<CellReportActionContextState | null>(null);

export function CellReportActionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<RowAction>();
  const [selectedCellReport, setSelectedCellReport] =
    useState<CellReportRecord | null>(null);

  const handleAction = (action: RowAction) => {
    setAction(action);
    setOpen(false);
  };

  const resetState = () => {
    setAction(undefined);
    setSelectedCellReport(null);
    setOpen(false);
  };

  return (
    <CellReportActionContext.Provider
      value={{
        action,
        selectedCellReport,
        open,
        handleAction,
        resetState,
        setOpen,
        setSelectedCellReport,
      }}
    >
      {children}
      <Drawer
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            setSelectedCellReport(null);
          }
        }}
      >
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

      {selectedCellReport ? (
        <>
          <Sheet
            open={action === "view"}
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
              <SheetHeader className="border-b p-4 text-left">
                <SheetTitle>Cell Report Details</SheetTitle>
                <div className="flex items-center justify-between">
                  <SheetDescription>
                    Information about this cell report.
                  </SheetDescription>
                  <Badge variant={selectedCellReport.type}>
                    {selectedCellReport.type}
                  </Badge>
                </div>
              </SheetHeader>

              <div className="max-h-[calc(100%-69px)] flex-1 overflow-y-auto pt-1 pb-4">
                <CellReportDetails cellReport={selectedCellReport} />
              </div>

              <div className="mt-auto flex justify-end gap-3 border-t p-4 text-right">
                <SheetClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-muted/30"
                  >
                    Close
                  </Button>
                </SheetClose>
                <GeneratePDFButtonWide cellReport={selectedCellReport} />
              </div>
            </SheetContent>
          </Sheet>

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
              onInteractOutside={(e) => e.preventDefault()}
            >
              <SheetHeader className="space-y-1 border-b p-4 text-left">
                <SheetTitle>Update Cell Report Details</SheetTitle>
                <SheetDescription>
                  Make sure to save your changes.
                </SheetDescription>
              </SheetHeader>
              <CellReportEditForm
                cellReport={selectedCellReport}
                onAfterSave={() => resetState()}
              />
            </SheetContent>
          </Sheet>
        </>
      ) : null}
    </CellReportActionContext.Provider>
  );
}

export function useCellReportAction() {
  const context = React.useContext(CellReportActionContext);

  if (!context)
    throw new Error(
      `useCellReportAction must be used inside a <CellReportActionContext />`,
    );

  return context;
}

export function CellReportActionButton({
  cellReport,
}: {
  cellReport: CellReportRecord;
}) {
  const { setOpen, setSelectedCellReport } = useCellReportAction();

  return (
    <Button
      size="iconSm"
      variant="ghost"
      aria-label="Cell Report actions"
      onClick={() => {
        setOpen(true);
        setSelectedCellReport(cellReport);
      }}
    >
      <MoreHorizontalIcon />
    </Button>
  );
}
