import type { Metadata } from "next";
import { SoulWinningReportType } from "@/app/generated/prisma";
import { DataPagination } from "@/components/data-pagination";
import { ConsolidationReportsTable } from "@/features/soul-winning/consolidation-reports-table";
import {
  getSoulWinningReports,
  type SoulWinningReportsQueryArgs,
} from "@/features/soul-winning/queries";
import { SoulWinningFilters } from "@/features/soul-winning/soul-winning-filters";

export const metadata: Metadata = {
  title: "Consolidation Reports",
};

interface PageProps {
  searchParams: Promise<SoulWinningReportsQueryArgs>;
}

async function ConsolidationReportsPage({ searchParams }: PageProps) {
  const pageSearchParams = await searchParams;

  const {
    soulWinningReports: consolidationReports,
    pageInfo,
    isAdmin,
    isPastor,
    user,
  } = await getSoulWinningReports({
    ...pageSearchParams,
    type: SoulWinningReportType.CONSOLIDATION,
  });

  return (
    <div className="flex flex-1 flex-col gap-4">
      <SoulWinningFilters />
      <ConsolidationReportsTable
        consolidationReports={consolidationReports}
        userId={user.userId}
        withLeader={isAdmin || isPastor}
      />
      <DataPagination
        name="consolidation reports"
        pageInfo={pageInfo}
        pageSizeOptions={[10, 20, 40, 50, 100]}
      />
    </div>
  );
}

export default ConsolidationReportsPage;
