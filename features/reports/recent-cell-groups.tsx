"use client";

import { ArrowRightIcon, CalendarIcon, PackageIcon } from "lucide-react";
import Link from "next/link";
import pluralize from "pluralize";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCellGroupStatistics } from "@/hooks/use-cell-group-statistics";
import {
  formatCellGroupDate,
  formatDate,
  removeUnderscores,
} from "@/lib/utils";

export function RecentCellGroups() {
  const cgQuery = useCellGroupStatistics({ dateRange: "this_week" });

  const periodDate = cgQuery.data?.dateRangeFilter;

  const cellGroups = cgQuery.data?.cellReports;

  if (cgQuery.isLoading)
    return (
      <Card className="py-4 gap-0">
        <CardHeader className="border-b px-4 [.border-b]:pb-4">
          <CardTitle>Recent Cell Groups</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Skeleton className="h-4 w-48" />
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <Skeleton className="h-[252px]" />
        </CardContent>
      </Card>
    );

  return (
    <Card className="py-4 gap-0">
      <CardHeader className="border-b px-4 [.border-b]:pb-4">
        <CardTitle>Recent Cell Groups</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <CalendarIcon className="size-3" />
          <span>
            {formatDate(periodDate?.start as string)} -
            {formatDate(periodDate?.end as string)}
          </span>
        </CardDescription>
        {cellGroups?.length === 0 ? null : (
          <CardAction>
            <Button
              size="sm"
              variant="link"
              asChild
              className="text-blue-500 px-0 has-[>svg]:px-0"
            >
              <Link
                href={{
                  pathname: "/cell-reports",
                  query: { dateRange: "this_week" },
                }}
              >
                View All <ArrowRightIcon />
              </Link>
            </Button>
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="px-4">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-card bg-card">
              <TableHead>Led by</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date & Venue</TableHead>
              <TableHead>Lesson</TableHead>
              <TableHead># Attendees</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cellGroups?.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5}>
                  <div className="min-h-[300px] flex flex-col items-center justify-center gap-3">
                    <PackageIcon className="size-6 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground text-center">
                      No recent cell reports yet.
                    </p>
                    <Button asChild>
                      <Link href="/cell-reports">Go to Cell Reports</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              cellGroups?.slice(0, 6)?.map((cellgroup) => (
                <TableRow key={cellgroup.id} className="hover:bg-card">
                  <TableCell>
                    {cellgroup.assistant ? (
                      <div>
                        <Link
                          href={`/disciples/${cellgroup.assistantId}`}
                          className="font-semibold hover:underline"
                        >
                          {cellgroup.assistant.name}
                        </Link>
                        <p className="text-xs text-muted-foreground capitalize">
                          Assistant Leader
                        </p>
                      </div>
                    ) : (
                      <div>
                        <Link
                          href={`/disciples/${cellgroup.leaderId}`}
                          className="font-semibold hover:underline"
                        >
                          {cellgroup.leader.name}
                        </Link>
                        <p className="text-xs text-muted-foreground capitalize">
                          Primary Leader
                        </p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={cellgroup.type}>
                      {removeUnderscores(cellgroup.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <p className="text-sm line-clamp-1">{cellgroup.venue}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCellGroupDate(new Date(cellgroup.date))}
                    </p>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {cellgroup.lessonTitle ? (
                      <div>
                        <p className="font-semibold">{cellgroup.lessonTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          Custom Lesson
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold hover:underline">
                          {cellgroup.lesson?.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {cellgroup.lesson?.lessonSeries.title}
                        </p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="DISCIPLESHIP">
                      {cellgroup.cellReportAttendeeSnapshots.length}{" "}
                      {pluralize(
                        "attendee",
                        cellgroup.cellReportAttendeeSnapshots.length,
                      )}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
