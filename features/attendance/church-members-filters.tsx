"use client";

import { FilterField } from "@/components/filter-field";
import { SearchField } from "@/components/ui/search-field";
import { memberTypes } from "@/lib/constants";

export function ChurchMembersFilters() {
  return (
    <div className="ml-auto flex items-center gap-3">
      <SearchField placeholder="Search by name" paramName="q" />
      <FilterField
        label="Member Type"
        options={memberTypes}
        queryName="memberType"
        singleSelection
      />
    </div>
  );
}
