import type { Metadata } from "next";
import { SoulWinningReportType } from "@/app/generated/prisma";
import { DataPagination } from "@/components/data-pagination";
import {
  getSoulWinningReports,
  type SoulWinningReportsQueryArgs,
} from "@/features/soul-winning/queries";
import { SoulWinningFilters } from "@/features/soul-winning/soul-winning-filters";
import { SoulWinningReportsTable } from "@/features/soul-winning/soul-winning-reports-table";

export const metadata: Metadata = {
  title: "Soul Winning",
};

interface PageProps {
  searchParams: Promise<SoulWinningReportsQueryArgs>;
}

async function SoulWinningPage({ searchParams }: PageProps) {
  const pageSearchParams = await searchParams;

  const { soulWinningReports, pageInfo, isAdmin, isPastor, user } =
    await getSoulWinningReports({
      ...pageSearchParams,
      type: SoulWinningReportType.SOUL_WINNING,
    });

  return (
    <div className="flex flex-1 flex-col gap-4">
      <SoulWinningFilters />
      <SoulWinningReportsTable
        soulWinningReports={soulWinningReports}
        userId={user.userId}
        withLeader={isAdmin || isPastor}
      />
      <DataPagination
        name="soul-winning reports"
        pageInfo={pageInfo}
        pageSizeOptions={[10, 20, 40, 50, 100]}
      />
    </div>
  );
}

export default SoulWinningPage;
