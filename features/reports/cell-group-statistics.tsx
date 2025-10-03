"use client";

import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/date-range-picker";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCellGroupStatistics } from "@/hooks/use-cell-group-statistics";
import { formatDate, getClientDateRange } from "@/lib/utils";
import type { DateRange as Preset } from "@/types/globals";
import { CellGroupByType } from "./cell-group-by-type";
import { CellGroupTrend } from "./cell-group-trend";
import { CellGroupWithAssistants } from "./cell-group-with-assistants";

function getDateRangeLabel(dateRange: Preset) {
  switch (dateRange) {
    case "today":
      return "today";
    case "this_week":
      return "this week";
    case "last_week":
      return "last week";
    case "this_month":
      return "this month";
    case "last_month":
      return "last month";
    case "year_to_date":
      return "this year";
    default:
      return "";
  }
}

export function CellGroupStatistics() {
  const [preset, setPreset] = useState<Preset>("this_week");

  const thisWeek = getClientDateRange(preset);

  const dateRangeLabel = getDateRangeLabel(preset);

  const [date, setDate] = useState<DateRange>({
    from: thisWeek?.start,
    to: thisWeek?.end,
  });

  const cgStatsQuery = useCellGroupStatistics({
    dateRange: date,
  });

  const periodDate = cgStatsQuery.data?.dateRangeFilter;

  return (
    <Card className="@container/card gap-0 bg-card/60 pt-4 pb-0">
      <CardHeader className="border-b px-4 [.border-b]:pb-4">
        <CardTitle>Cell Groups</CardTitle>
        {cgStatsQuery.isLoading ? (
          <Skeleton className="h-4 w-32" />
        ) : (
          <CardDescription className="flex items-center gap-1.5 text-xs">
            <CalendarIcon className="size-3 shrink-0" />
            <span className="block">
              {formatDate(periodDate?.start as string)} -{" "}
              {formatDate(periodDate?.end as string)}
            </span>
          </CardDescription>
        )}
        <CardAction>
          <DateRangePicker
            dateRangeValue={date}
            setDateRangeValue={setDate}
            preset={preset}
            setPreset={setPreset}
          />
        </CardAction>
        {/* <CardAction className="hidden">
          <ToggleGroup
            type="single"
            value={dateRange}
            onValueChange={setDateRange}
            variant="outline"
            size="sm"
            disabled={cgStatsQuery.isLoading}
            className="*:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="this_week">This week</ToggleGroupItem>
            <ToggleGroupItem value="last_week">Last week</ToggleGroupItem>
            <ToggleGroupItem value="this_month">This month</ToggleGroupItem>
            <ToggleGroupItem value="last_month">Last month</ToggleGroupItem>
            <ToggleGroupItem value="year_to_date">Year-to-date</ToggleGroupItem>
          </ToggleGroup>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger
              className="flex @[767px]/card:hidden **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
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
              <SelectItem value="year_to_date" className="rounded-lg">
                Year-to-date
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction> */}
      </CardHeader>
      <CardContent className="px-0">
        {cgStatsQuery.isLoading ? (
          <div className="grid grid-cols-1 gap-2 p-4 lg:grid-cols-3">
            <Skeleton className="h-[172px] lg:h-[188px]" />
            <Skeleton className="h-[172px] lg:h-[188px]" />
            <Skeleton className="h-[172px] lg:h-[188px]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
            <CellGroupByType
              dateRangeLabel={dateRangeLabel}
              cellReports={cgStatsQuery.data?.cellReports ?? []}
            />
            <Separator orientation="vertical" className="hidden lg:block" />
            <Separator className="lg:hidden" />
            <CellGroupWithAssistants
              cellReports={cgStatsQuery.data?.cellReports ?? []}
            />
            <Separator orientation="vertical" className="hidden lg:block" />
            <Separator className="lg:hidden" />
            <CellGroupTrend
              currentCellReports={cgStatsQuery.data?.cellReports ?? []}
              selectedDateRange={preset as Preset}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
