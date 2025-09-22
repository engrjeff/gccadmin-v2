"use client";

import { CircleDotIcon, TrendingUpIcon } from "lucide-react";
import { FilterField } from "@/components/filter-field";
import { LeadersFilter } from "@/components/leaders-filter";
import { ResetFiltersButton } from "@/components/reset-filters-button";
import { SearchField } from "@/components/ui/search-field";
import { cellStatuses, churchStatuses, processLevels } from "@/lib/constants";

export function DisciplesFilters() {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <SearchField paramName="q" />
      <FilterField
        label="Cell Status"
        options={cellStatuses}
        Icon={CircleDotIcon}
        queryName="cellStatus"
      />
      <FilterField
        label="Church Status"
        options={churchStatuses}
        Icon={CircleDotIcon}
        queryName="churchStatus"
      />
      <FilterField
        label="Process Level"
        options={processLevels}
        Icon={TrendingUpIcon}
        queryName="processLevel"
      />
      <LeadersFilter />

      <ResetFiltersButton
        validFilters={["cellStatus", "churchStatus", "processLevel", "leader"]}
      />
    </div>
  );
}
