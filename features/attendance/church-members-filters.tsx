"use client";

import type { Gender } from "@/app/generated/prisma";
import { FilterField } from "@/components/filter-field";
import { SearchField } from "@/components/ui/search-field";
import { memberTypes } from "@/lib/constants";

export function ChurchMembersFilters({
  view,
}: {
  view: Gender | "NewComers" | "Leaders" | "Returnees";
}) {
  if (["NewComers", "Leaders"].includes(view)) return null;

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
        className="h-8"
      />
    </div>
  );
}
