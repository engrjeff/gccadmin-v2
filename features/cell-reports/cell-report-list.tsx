"use client";

import { ChevronRightIcon, PackageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  List,
  ListItem,
  ListItemContent,
  ListItemPrimary,
  ListItemSecondary,
  ListItemTrailing,
} from "@/components/ui/list";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CellReportDetails } from "./cell-report-details";
import { GeneratePDFButtonWide } from "./cell-report-pdf";
import type { CellReportRecord } from "./queries";

export function CellReportList({
  cellReports,
}: {
  cellReports: CellReportRecord[];
}) {
  return (
    <div className="sm:hidden">
      {cellReports.length === 0 ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
          <PackageIcon className="size-6 text-muted-foreground" />
          <p className="text-center text-muted-foreground text-sm">
            No cell report records found.
          </p>
        </div>
      ) : (
        <List className="min-h-[40vh]">
          {cellReports.map((cellReport) => (
            <CellReportItem key={cellReport.id} cellReport={cellReport} />
          ))}
        </List>
      )}
    </div>
  );
}

function CellReportItem({ cellReport }: { cellReport: CellReportRecord }) {
  return (
    <ListItem className="relative bg-card/40">
      <Badge variant={cellReport.type} className="absolute top-1 right-1">
        {cellReport.type}
      </Badge>
      <ListItemContent>
        <ListItemPrimary className="flex items-center gap-2 hover:underline">
          Led by:{" "}
          {cellReport.assistant
            ? cellReport.assistant.name
            : cellReport.leader.name}
        </ListItemPrimary>

        <ListItemSecondary>
          Network Leader: {cellReport.leader?.name}
        </ListItemSecondary>

        <ListItemSecondary className="mt-3 text-foreground">
          {cellReport.lessonTitle
            ? cellReport.lessonTitle
            : cellReport.lesson?.title}
        </ListItemSecondary>
        <ListItemSecondary>
          {cellReport.hasCustomLesson
            ? "Custom Lesson"
            : cellReport.lesson?.lessonSeries?.title}
        </ListItemSecondary>

        <ListItemSecondary className="mt-3 text-foreground">
          {cellReport.venue}
        </ListItemSecondary>
        <ListItemSecondary>{cellReport.date}</ListItemSecondary>
      </ListItemContent>
      <ListItemTrailing onClick={() => {}}>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="iconSm"
              variant="ghost"
              className="rounded-full"
              aria-label="View Details"
            >
              <ChevronRightIcon />
            </Button>
          </SheetTrigger>
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
      </ListItemTrailing>
    </ListItem>
  );
}
