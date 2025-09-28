import type { Metadata } from "next";
import { SearchField } from "@/components/ui/search-field";
import { LeadersTable } from "@/features/leaders/leaders-table";
import { getLeaders, type LeadersQueryArgs } from "@/features/leaders/queries";
import { SendCellReportReminderButton } from "@/features/leaders/send-cell-report-reminder-button";

export const metadata: Metadata = {
  title: "Leaders",
};

interface PageProps {
  searchParams: Promise<LeadersQueryArgs>;
}

async function LeadersPage({ searchParams }: PageProps) {
  const pageSearchParams = await searchParams;

  const leaders = await getLeaders(pageSearchParams);

  return (
    <div className="flex-1">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-bold">Primary Leaders</h2>
            <p className="text-muted-foreground text-sm">
              List of GCC Primary Leaders
            </p>
          </div>
          <SendCellReportReminderButton
            data={leaders
              .filter((l) => l.userAccount?.email)
              .map((i) => ({
                name: i.name,
                email: i.userAccount?.email as string,
              }))}
          />
        </div>
        <div className="flex items-center gap-3">
          <SearchField paramName="q" />
        </div>
        <div className="flex-1">
          <LeadersTable leaders={leaders} />
        </div>
      </div>
    </div>
  );
}

export default LeadersPage;
