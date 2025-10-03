"use client";

import {
  ArrowRightIcon,
  ChartColumnIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
import Link from "next/link";
import pluralize from "pluralize";
import type { CellReport } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCellGroupStatistics } from "@/hooks/use-cell-group-statistics";
import { getClientDateRange } from "@/lib/utils";
import type { DateRange } from "@/types/globals";

function getDateRangeLabel(dateRange: DateRange) {
  switch (dateRange) {
    case "this_week":
      return "this week";
    case "last_week":
      return "last week";
    case "this_month":
      return "this month";
    case "last_month":
      return "last month";
    case "last_last_month":
      return "last month";
    case "year_to_date":
      return "this year";
    default:
      return "";
  }
}

function getPreviousDateRangeType(currentDateRange: DateRange) {
  switch (currentDateRange) {
    case "this_week":
      return "last_week";
    case "last_week":
      return "this_week";
    case "this_month":
      return "last_month";
    case "last_month":
      return "this_month";
    case "year_to_date":
      return "year_to_date";
    default:
      return "last_week";
  }
}

export function CellGroupTrend({
  selectedDateRange,
  currentCellReports,
}: {
  selectedDateRange: DateRange;
  currentCellReports: CellReport[];
}) {
  const dateRange = getPreviousDateRangeType(selectedDateRange);

  const dateRangeLabel = getDateRangeLabel(dateRange);

  const range = getClientDateRange(dateRange);

  const cgsQuery = useCellGroupStatistics({
    dateRange: { from: range?.start, to: range?.end },
  });

  const previousReports = cgsQuery.data?.cellReports ?? [];

  const currentCount = currentCellReports.length ?? 0;
  const previousCount = previousReports.length ?? 0;

  const percentDelta =
    currentCount === 0
      ? 100
      : ((previousCount - currentCount) / currentCount) * 100;

  const trend = percentDelta < 0 ? "up" : "down";

  return (
    <div className="relative flex flex-col gap-3 p-4">
      <p className="font-semibold text-sm">Cell Group Trend</p>
      <div className="text-muted-foreground text-sm">Total Cell Groups</div>
      <div className="flex items-end gap-2">
        <div className="font-semibold text-4xl tabular-nums">
          {currentCount}
        </div>
        {selectedDateRange === "year_to_date" ? (
          <p className="text-muted-foreground text-sm">cell groups this year</p>
        ) : (
          <p className="text-muted-foreground text-sm">
            compared to {previousCount} {pluralize("report", previousCount)}{" "}
            {dateRangeLabel}
          </p>
        )}
      </div>
      <div className="absolute top-4 right-4">
        {selectedDateRange === "year_to_date" ? (
          <Badge variant="ACTIVE">
            <ChartColumnIcon />
            YTD
          </Badge>
        ) : (
          <Badge variant={trend === "up" ? "ACTIVE" : "INACTIVE"}>
            {trend === "up" ? <TrendingUpIcon /> : <TrendingDownIcon />}
            {trend === "up" ? "+" : "-"}
            {Math.abs(percentDelta).toFixed(1)}%
          </Badge>
        )}
      </div>
      <div className="mt-auto">
        <Button
          size="sm"
          variant="link"
          asChild
          className="px-0 text-blue-500 has-[>svg]:px-0"
        >
          <Link
            href={{
              pathname: "/cell-reports",
              query: { dateRange: selectedDateRange },
            }}
          >
            View Reports <ArrowRightIcon />
          </Link>
        </Button>
      </div>
    </div>
  );
}
