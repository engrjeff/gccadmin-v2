import type { Metadata } from "next";
import { SearchField } from "@/components/ui/search-field";
import { LeadersTable } from "@/features/leaders/leaders-table";
import { getLeaders } from "@/features/leaders/queries";

export const metadata: Metadata = {
  title: "Leaders",
};

async function LeadersPage() {
  const leaders = await getLeaders();

  return (
    <div className="flex-1">
      <div className="max-w-5xl mx-auto flex flex-col gap-4 p-4">
        <div className="flex items-center gap-4">
          <h2 className="font-bold">Primary Leaders</h2>
        </div>
        <div className="flex items-center gap-3">
          <SearchField />
        </div>
        <div className="flex-1">
          <LeadersTable leaders={leaders} />
        </div>
      </div>
    </div>
  );
}

export default LeadersPage;
