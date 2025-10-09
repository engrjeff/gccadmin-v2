"use client";

import {
  BookOpenIcon,
  CalendarIcon,
  MapPinIcon,
  PackageIcon,
} from "lucide-react";
import { CellType } from "@/app/generated/prisma";
import {
  List,
  ListItem,
  ListItemContent,
  ListItemLeading,
  ListItemPrimary,
  ListItemSecondary,
} from "@/components/ui/list";
import type { CellReportRecord } from "@/types/globals";
import { CellReportMobileActions } from "./cell-report-row-actions";

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

function CellTypeIndicator({ cellType }: { cellType: CellType }) {
  if (cellType === CellType.OPEN) {
    return (
      <span className="-ml-1.5 inline-block h-14 w-1 rounded-full bg-green-500"></span>
    );
  }

  if (cellType === CellType.DISCIPLESHIP) {
    return (
      <span className="-ml-1 .-ml-1.5inline-block h-14 w-1 rounded-full bg-blue-500"></span>
    );
  }

  if (cellType === CellType.SOULWINNING) {
    return (
      <span className="-ml-1.5 inline-block h-14 w-1 rounded-full bg-yellow-500"></span>
    );
  }
}

function CellReportItem({ cellReport }: { cellReport: CellReportRecord }) {
  return (
    <ListItem className="relative bg-card/40">
      <ListItemLeading>
        <CellTypeIndicator cellType={cellReport.type} />
      </ListItemLeading>
      <ListItemContent>
        <ListItemPrimary className="flex items-center gap-2 hover:underline">
          Led By:{" "}
          {cellReport.assistant
            ? cellReport.assistant.name
            : cellReport.leader.name}{" "}
        </ListItemPrimary>
        <ListItemSecondary className="flex items-center gap-2 truncate whitespace-nowrap text-xs">
          <BookOpenIcon className="size-3 shrink-0" />{" "}
          {cellReport.lessonTitle
            ? cellReport.lessonTitle
            : cellReport.lesson?.title}{" "}
        </ListItemSecondary>
        <ListItemSecondary className="flex items-center gap-2 truncate whitespace-nowrap text-muted-foreground text-xs">
          <MapPinIcon className="size-3 shrink-0" /> {cellReport.venue}
        </ListItemSecondary>
        <ListItemSecondary className="flex items-center gap-2 truncate whitespace-nowrap text-muted-foreground text-xs">
          <CalendarIcon className="size-3 shrink-0" />
          {cellReport.date}
        </ListItemSecondary>
      </ListItemContent>
      <CellReportMobileActions cellReport={cellReport} />
    </ListItem>
  );
}
