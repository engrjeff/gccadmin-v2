"use client";

import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCellGroupStatistics } from "@/hooks/use-cell-group-statistics";
import { formatDate } from "@/lib/utils";
import type { DateRange } from "@/types/globals";
import { CellGroupByType } from "./cell-group-by-type";
import { CellGroupTrend } from "./cell-group-trend";
import { CellGroupWithAssistants } from "./cell-group-with-assistants";

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
    default:
      return "";
  }
}

export function CellGroupStatistics() {
  const [dateRange, setDateRange] = useState<DateRange | string>("this_week");

  const dateRangeLabel = getDateRangeLabel(dateRange as DateRange);

  const cgStatsQuery = useCellGroupStatistics({
    dateRange: dateRange as DateRange,
  });

  const periodDate = cgStatsQuery.data?.dateRangeFilter;

  return (
    <Card className="@container/card pt-4 pb-0 lg:pb-4 gap-0">
      <CardHeader className="border-b px-4 [.border-b]:pb-4">
        <CardTitle>Cell Groups</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for {dateRangeLabel}
          </span>
          <span className="@[540px]/card:hidden">{dateRangeLabel}</span>
        </CardDescription>
        {cgStatsQuery.isLoading ? (
          <Skeleton className="h-4 w-48" />
        ) : (
          <div className="lg:hidden col-span-full text-xs text-muted-foreground flex items-center gap-1.5">
            <CalendarIcon className="size-3 shrink-0" />
            <span className="block">
              {formatDate(periodDate?.start as string)} -
              {formatDate(periodDate?.end as string)}
            </span>
          </div>
        )}
        <CardAction>
          <ToggleGroup
            type="single"
            value={dateRange}
            onValueChange={setDateRange}
            variant="outline"
            size="sm"
            disabled={cgStatsQuery.isLoading}
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="this_week">This week</ToggleGroupItem>
            <ToggleGroupItem value="last_week">Last week</ToggleGroupItem>
            <ToggleGroupItem value="this_month">This month</ToggleGroupItem>
            <ToggleGroupItem value="last_month">Last month</ToggleGroupItem>
          </ToggleGroup>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger
              className="flex w-32 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="This week" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="this_week" className="rounded-lg">
                This week
              </SelectItem>
              <SelectItem value="last_week" className="rounded-lg">
                Last week
              </SelectItem>
              <SelectItem value="this_month" className="rounded-lg">
                This month
              </SelectItem>
              <SelectItem value="last_month" className="rounded-lg">
                Last month
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        {cgStatsQuery.isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 p-4">
            <Skeleton className="h-[172px] lg:h-[188px]" />
            <Skeleton className="h-[172px] lg:h-[188px]" />
            <Skeleton className="h-[172px] lg:h-[188px]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr] gap-2">
            <CellGroupByType
              dateRangeLabel={dateRangeLabel}
              cellReports={cgStatsQuery.data?.cellReports ?? []}
            />
            <Separator orientation="vertical" className="hidden lg:block" />
            <Separator className=" lg:hidden" />
            <CellGroupWithAssistants
              cellReports={cgStatsQuery.data?.cellReports ?? []}
            />
            <Separator orientation="vertical" className="hidden lg:block" />
            <Separator className=" lg:hidden" />
            <CellGroupTrend
              currentCellReports={cgStatsQuery.data?.cellReports ?? []}
              selectedDateRange={dateRange as DateRange}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t px-4 [.border-t]:pt-4 hidden lg:flex">
        {cgStatsQuery.isLoading ? (
          <Skeleton className="h-4 w-48" />
        ) : (
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <CalendarIcon className="size-3" />
            <span>
              Period: {formatDate(periodDate?.start as string)} -
              {formatDate(periodDate?.end as string)}
            </span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
