"use client";

import { MoreHorizontalIcon, PencilIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CellReportDetails } from "./cell-report-details";
import { GeneratePDFButton } from "./cell-report-pdf";
import type { CellReportRecord } from "./queries";

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
            <GeneratePDFButton cellReport={cellReport} />
            <DropdownMenuItem disabled onClick={() => setAction("edit")}>
              <PencilIcon />
              Edit
            </DropdownMenuItem>
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

          <div className="max-h-[calc(100%-69px)] flex-1 overflow-y-auto py-4">
            <CellReportDetails cellReport={cellReport} />
          </div>

          <SheetFooter className="mt-auto flex gap-3 border-t p-4 text-right">
            <SheetClose asChild>
              <Button type="button" variant="outline" className="bg-muted/30">
                Close
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
