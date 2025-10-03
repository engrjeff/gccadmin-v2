"use client";

import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate, getClientDateRange, removeUnderscores } from "@/lib/utils";
import type { DateRange as Preset } from "@/types/globals";

interface Props {
  dateRangeValue: DateRange | undefined;
  setDateRangeValue: (value: DateRange) => void;
  preset: Preset;
  setPreset: (preset: Preset) => void;
}

export function DateRangePicker(props: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <CalendarIcon />{" "}
          {props.dateRangeValue ? (
            <div>
              <span className="hidden sm:block">
                {formatDate(props.dateRangeValue?.from?.toString() as string)} -{" "}
                {formatDate(props.dateRangeValue?.to?.toString() as string)}
              </span>
              <span className="capitalize sm:hidden">
                {removeUnderscores(props.preset)}
              </span>
            </div>
          ) : (
            "Date Range"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-min p-0">
        <DateRangeContent {...props} />
      </PopoverContent>
    </Popover>
  );
}

function DateRangeContent({
  dateRangeValue,
  setDateRangeValue,
  preset,
  setPreset,
}: Props) {
  const today = new Date();

  const thisWeek = getClientDateRange("this_week");
  const lastWeek = getClientDateRange("last_week");
  const thisMonth = getClientDateRange("this_month");
  const lastMonth = getClientDateRange("last_month");
  const ytd = getClientDateRange("year_to_date");

  const [date, setDate] = useState<DateRange | undefined>(
    dateRangeValue
      ? dateRangeValue
      : {
          from: thisWeek?.start,
          to: thisWeek?.end,
        },
  );

  const [month, setMonth] = useState(
    dateRangeValue ? dateRangeValue.from : today,
  );

  function handleDateRangeChange(value: DateRange | undefined) {
    if (!value) {
      setDate({ from: thisWeek?.start, to: thisWeek?.end });
      setMonth(thisWeek?.start as Date);
      setDateRangeValue({ from: thisWeek?.start, to: thisWeek?.end });
    } else {
      setDate(value);
      setMonth(value.from as Date);
      setDateRangeValue(value);
    }
  }

  return (
    <div className="flex gap-2 py-2 max-sm:flex-col">
      <div className="relative sm:w-min">
        <div className="h-full sm:border-e">
          <div className="flex flex-col gap-1 px-2">
            <Button
              variant={preset === "today" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                handleDateRangeChange({ from: today, to: today });
                setPreset("today");
              }}
            >
              Today
            </Button>
            <Button
              variant={preset === "this_week" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                handleDateRangeChange({
                  from: thisWeek?.start,
                  to: thisWeek?.end,
                });
                setPreset("this_week");
              }}
            >
              This Week
            </Button>
            <Button
              variant={preset === "last_week" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                handleDateRangeChange({
                  from: lastWeek?.start,
                  to: lastWeek?.end,
                });
                setPreset("last_week");
              }}
            >
              Last Week
            </Button>
            <Button
              variant={preset === "this_month" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                handleDateRangeChange({
                  from: thisMonth?.start,
                  to: thisMonth?.end,
                });
                setPreset("this_month");
              }}
            >
              This Month
            </Button>
            <Button
              variant={preset === "last_month" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                handleDateRangeChange({
                  from: lastMonth?.start,
                  to: lastMonth?.end,
                });
                setPreset("last_month");
              }}
            >
              Last Month
            </Button>
            <Button
              variant={preset === "year_to_date" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                handleDateRangeChange({ from: ytd?.start, to: ytd?.end });
                setPreset("year_to_date");
              }}
            >
              Year to date
            </Button>
          </div>
        </div>
      </div>
      <Calendar
        mode="range"
        selected={date}
        weekStartsOn={1}
        numberOfMonths={2}
        pagedNavigation
        onSelect={(newDate) => {
          if (newDate) {
            setPreset("custom");
            handleDateRangeChange(newDate);
          }
        }}
        month={month}
        onMonthChange={setMonth}
        className="hidden px-2 py-0 md:block"
        disabled={[
          { after: today }, // Dates before today
        ]}
      />
    </div>
  );
}
