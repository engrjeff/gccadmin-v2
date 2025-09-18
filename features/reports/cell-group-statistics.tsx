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
import { CellGroupWithAssistants } from "./cell-group-with-assistants";

function getDateRangeLabel(dateRange: DateRange) {
  switch (dateRange) {
    case "this_week":
      return "this week";
    case "last_week":
      return "last week";
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
    <Card className="@container/card">
      <CardHeader className="border-b">
        <CardTitle>Cell Groups</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for {dateRangeLabel}
          </span>

          <span className="@[540px]/card:hidden">{dateRangeLabel}</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={dateRange}
            onValueChange={setDateRange}
            variant="outline"
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
      <CardContent>
        {cgStatsQuery.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-6 h-[156px]">
            <Skeleton className="h-full" />
            <Separator orientation="vertical" className="hidden md:block" />
            <Separator className=" md:hidden" />
            <Skeleton className="h-full" />
            <Separator orientation="vertical" className="hidden md:block" />
            <Separator className=" md:hidden" />
            <Skeleton className="h-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-6">
            <CellGroupByType
              dateRangeLabel={dateRangeLabel}
              cellReports={cgStatsQuery.data?.cellReports ?? []}
            />
            <Separator orientation="vertical" className="hidden md:block" />
            <Separator className=" md:hidden" />
            <CellGroupWithAssistants
              cellReports={cgStatsQuery.data?.cellReports ?? []}
            />
            <Separator orientation="vertical" className="hidden md:block" />
            <Separator className=" md:hidden" />
            <div></div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t">
        {cgStatsQuery.isLoading ? (
          <Skeleton className="h-4 w-48" />
        ) : (
          <div className="text-xs text-muted-foreground flex items-center gap-2">
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
