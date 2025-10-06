"use client";

import {
  BookOpenIcon,
  CalendarIcon,
  MapPinIcon,
  PackageIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useLessonsTaken } from "@/hooks/use-lessons-taken";
import { removeUnderscores } from "@/lib/utils";
import { CellReportDetails } from "../cell-reports/cell-report-details";

export function AttendedCellGroups() {
  const query = useLessonsTaken();

  if (query.isLoading)
    return (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Attended Cell Groups</h3>
          <p className="text-muted-foreground text-sm">
            List of attended cell groups
          </p>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[92px] w-full" />
          <Skeleton className="h-[92px] w-full" />
          <Skeleton className="h-[92px] w-full" />
          <Skeleton className="h-[92px] w-full" />
        </div>
      </div>
    );

  const attendedCellGroups = query.data?.attendedCellGroups;

  return (
    <div className="flex-1 space-y-4">
      <div>
        <h3 className="font-semibold">Attended Cell Groups</h3>
        <p className="text-muted-foreground text-sm">
          List of attended cell groups
        </p>
      </div>
      {attendedCellGroups?.length === 0 ? (
        <div className="flex min-h-[350px] flex-col items-center justify-center gap-3 rounded-md border border-dashed">
          <PackageIcon className="size-6 text-muted-foreground" />
          <p className="text-center text-muted-foreground text-sm">
            No cell groups attended yet.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {attendedCellGroups?.map((cellgroup) => (
            <li key={cellgroup.id}>
              <Sheet>
                <SheetTrigger asChild>
                  <div className="space-y-3 rounded-md border bg-card/60 py-3 hover:bg-card/30">
                    <div className="grid grid-cols-1 items-center gap-2 px-3 md:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-0.5">
                        <Badge variant={cellgroup.type}>
                          {removeUnderscores(cellgroup.type)}
                        </Badge>
                        <p className="font-semibold text-sm">
                          {cellgroup.assistantId
                            ? cellgroup.assistant?.name
                            : cellgroup.leader.name}
                        </p>
                        <p className="line-clamp-1 text-muted-foreground text-xs">
                          {cellgroup.assistantId
                            ? "Assistant Leader"
                            : "Network Leader"}
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <p className="flex items-center gap-2 text-muted-foreground text-xs">
                          <CalendarIcon className="size-3" /> {cellgroup.date}
                        </p>
                        <p className="line-clamp-1 flex items-center gap-2 text-muted-foreground text-xs">
                          <MapPinIcon className="size-3" /> {cellgroup.venue}
                        </p>
                        <p className="line-clamp-1 flex items-center gap-2 text-muted-foreground text-xs">
                          <BookOpenIcon className="size-3" />{" "}
                          {cellgroup.lessonTitle
                            ? cellgroup.lessonTitle
                            : cellgroup.lesson?.title}
                        </p>
                      </div>
                    </div>
                  </div>
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
                      <Badge variant={cellgroup.type}>{cellgroup.type}</Badge>
                    </div>
                  </SheetHeader>

                  <div className="max-h-[calc(100%-69px)] flex-1 overflow-y-auto py-4">
                    <CellReportDetails cellReport={cellgroup} />
                  </div>

                  <SheetFooter className="mt-auto flex gap-3 border-t p-4 text-right">
                    <SheetClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-muted/30"
                      >
                        Close
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
