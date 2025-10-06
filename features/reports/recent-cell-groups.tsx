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
import { formatDate, getClientDateRange, removeUnderscores } from "@/lib/utils";

export function RecentCellGroups() {
  const thisWeek = getClientDateRange("this_week");

  const cgQuery = useCellGroupStatistics({
    dateRange: { from: thisWeek?.start, to: thisWeek?.end },
  });

  const periodDate = cgQuery.data?.dateRangeFilter;

  const cellGroups = cgQuery.data?.cellReports;

  if (cgQuery.isLoading)
    return (
      <Card className="gap-0 bg-card/60 py-4">
        <CardHeader className="border-b px-4 [.border-b]:pb-4">
          <CardTitle>Recent Cell Groups</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Skeleton className="h-4 w-32" />
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pb-0">
          <Skeleton className="h-[240px]" />
        </CardContent>
      </Card>
    );

  return (
    <Card className="gap-0 bg-card/60 py-4">
      <CardHeader className="border-b px-4 [.border-b]:pb-4">
        <CardTitle>Recent Cell Groups</CardTitle>
        <CardDescription className="flex items-center gap-2 text-xs">
          <CalendarIcon className="size-3" />
          <span>
            {formatDate(periodDate?.start as string)} -{" "}
            {formatDate(periodDate?.end as string)}
          </span>
        </CardDescription>
        {cellGroups?.length === 0 ? null : (
          <CardAction>
            <Button
              size="sm"
              variant="link"
              asChild
              className="px-0 text-blue-500 has-[>svg]:px-0"
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

      <CardContent className="flex-1 px-2 [&>div]:h-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-card hover:bg-card">
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
                  <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
                    <PackageIcon className="size-6 text-muted-foreground" />
                    <p className="text-center text-muted-foreground text-sm">
                      No recent cell reports yet.
                    </p>
                    <Button asChild>
                      <Link href="/cell-reports">Go to Cell Reports</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              cellGroups?.slice(0, 5)?.map((cellgroup) => (
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
                        <p className="text-muted-foreground text-xs capitalize">
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
                        <p className="text-muted-foreground text-xs capitalize">
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
                    <p className="line-clamp-1 text-sm">{cellgroup.venue}</p>
                    <p className="text-muted-foreground text-xs">
                      {cellgroup.date}
                    </p>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {cellgroup.lessonTitle ? (
                      <div>
                        <p className="font-semibold">{cellgroup.lessonTitle}</p>
                        <p className="text-muted-foreground text-xs">
                          Custom Lesson
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold hover:underline">
                          {cellgroup.lesson?.title}
                        </p>
                        <p className="text-muted-foreground text-xs">
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
