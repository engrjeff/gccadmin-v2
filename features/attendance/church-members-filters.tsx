"use client";

import { FilterField } from "@/components/filter-field";
import { SearchField } from "@/components/ui/search-field";
import { memberTypes } from "@/lib/constants";

export function ChurchMembersFilters() {
  return (
    <div className="flex items-center gap-3 px-px">
      <SearchField
        placeholder="Search by name"
        paramName="q"
        className="[&>input]:focus-visible:ring-0"
      />
      <FilterField
        label="Member Type"
        options={memberTypes}
        queryName="memberType"
        singleSelection
        className="h-9"
      />
    </div>
  );
}
