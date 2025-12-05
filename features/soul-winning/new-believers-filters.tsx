"use client";

import { SettingsIcon } from "lucide-react";
import { FilterField } from "@/components/filter-field";
import { LeadersFilter } from "@/components/leaders-filter";
import { ResetFiltersButton } from "@/components/reset-filters-button";
import { SearchField } from "@/components/ui/search-field";
import { WithWonSoulsDisciplesFilter } from "@/components/with-won-souls-disciples-filter";
import { memberTypes } from "@/lib/constants";

export function NewBelieversFilters() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <SearchField paramName="q" />
      <div className="flex flex-wrap items-center gap-3">
        <FilterField
          label="Member Type"
          options={memberTypes}
          queryName="memberType"
          singleSelection
        />

        <LeadersFilter isForPastor={true} />

        <WithWonSoulsDisciplesFilter label="Won By (144)" queryName="wonBy" />

        <FilterField
          label="View"
          options={[
            { label: "Soul-Winning Only", value: "soul-winning" },
            { label: "Consolidation Only", value: "consolidation" },
          ]}
          queryName="lessonView"
          singleSelection
          Icon={SettingsIcon}
        />

        <ResetFiltersButton
          validFilters={[
            "memberType",
            "leader",
            "handledby",
            "soulWinningReportId",
            "lessonView",
          ]}
        />
      </div>
    </div>
  );
}
