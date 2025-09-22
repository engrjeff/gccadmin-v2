"use client";

import { CalendarIcon, CircleDotDashedIcon } from "lucide-react";
import { CellType } from "@/app/generated/prisma";
import { FilterField } from "@/components/filter-field";
import { LeadersFilter } from "@/components/leaders-filter";
import { ResetFiltersButton } from "@/components/reset-filters-button";

export function CellReportsFilters() {
  return (
    <div className="flex items-center gap-3">
      <FilterField
        label="Cell Type"
        queryName="cellType"
        singleSection
        Icon={CircleDotDashedIcon}
        options={[
          { label: "Soul Winning", value: CellType.SOULWINNING },
          { label: "Open Cell", value: CellType.OPEN },
          { label: "Discipleship", value: CellType.DISCIPLESHIP },
        ]}
      />

      <FilterField
        queryName="dateRange"
        label="Date Range"
        singleSection
        Icon={CalendarIcon}
        options={[
          { label: "This Week", value: "this_week" },
          { label: "Last Week", value: "last_week" },
          { label: "This Month", value: "this_month" },
          { label: "Last Month", value: "last_month" },
        ]}
      />

      <LeadersFilter />

      <ResetFiltersButton validFilters={["cellType", "dateRange", "leader"]} />
    </div>
  );
}
