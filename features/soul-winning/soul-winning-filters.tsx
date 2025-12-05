"use client";

import { CalendarIcon } from "lucide-react";
import { FilterField } from "@/components/filter-field";
import { LeadersFilter } from "@/components/leaders-filter";
import { ResetFiltersButton } from "@/components/reset-filters-button";
import { WithWonSoulsDisciplesFilter } from "@/components/with-won-souls-disciples-filter";

export function SoulWinningFilters() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <FilterField
        queryName="dateRange"
        label="Date Range"
        singleSelection
        Icon={CalendarIcon}
        options={[
          { label: "This Week", value: "this_week" },
          { label: "Last Week", value: "last_week" },
          { label: "This Month", value: "this_month" },
          { label: "Last Month", value: "last_month" },
          { label: "Year To Date (YTD)", value: "year_to_date" },
        ]}
      />

      <LeadersFilter isForPastor={true} />

      <WithWonSoulsDisciplesFilter label="Won By (144)" queryName="assistant" />

      <ResetFiltersButton validFilters={["dateRange", "leader", "assistant"]} />
    </div>
  );
}
