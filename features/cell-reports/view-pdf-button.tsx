"use client";

import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { CellReportPDF } from "./cell-report-pdf";
import type { CellReportRecord } from "./queries";

export function ViewPDFButton({
  period,
  cellReports,
}: {
  period:
    | {
        start: Date;
        end: Date;
      }
    | undefined;
  cellReports: CellReportRecord[];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          className="hidden lg  :inline-flex"
          disabled={cellReports.length === 0}
        >
          View PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl px-0">
        <DialogHeader className="px-4">
          <DialogTitle>Cell Reports</DialogTitle>
          {period ? (
            <DialogDescription className="flex items-center gap-1">
              <CalendarIcon className="size-3" />
              <span>
                {formatDate(period?.start?.toISOString())} -
                {formatDate(period?.end.toISOString())}
              </span>
            </DialogDescription>
          ) : null}
        </DialogHeader>
        <div className="relative min-h-[70vh]">
          <CellReportPDF cellReports={cellReports} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
