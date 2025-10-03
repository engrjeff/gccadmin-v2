"use client";

import { CircleDotIcon, FlameIcon, TrendingUpIcon } from "lucide-react";
import { FilterField } from "@/components/filter-field";
import { LeadersFilter } from "@/components/leaders-filter";
import { ResetFiltersButton } from "@/components/reset-filters-button";
import { SearchField } from "@/components/ui/search-field";
import {
  cellStatuses,
  churchStatuses,
  discipleStatusOptions,
  memberTypes,
  processLevels,
} from "@/lib/constants";

export function DisciplesFilters() {
  return (
    <div className="hidden flex-col gap-3 md:flex">
      <SearchField paramName="q" />
      <div className="flex flex-wrap items-center gap-3">
        <FilterField
          label="Status"
          options={discipleStatusOptions}
          Icon={FlameIcon}
          queryName="status"
          singleSelection
        />

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
        <FilterField
          label="Member Type"
          options={memberTypes}
          queryName="memberType"
          singleSelection
        />

        <LeadersFilter />

        <ResetFiltersButton
          validFilters={[
            "memberType",
            "cellStatus",
            "churchStatus",
            "processLevel",
            "leader",
            "status",
          ]}
        />
      </div>
    </div>
  );
}
