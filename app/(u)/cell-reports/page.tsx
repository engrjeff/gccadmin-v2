import { CalendarIcon } from "lucide-react";
import type { Metadata } from "next";
import { DataPagination } from "@/components/data-pagination";
import { CellReportCreateFormModal } from "@/features/cell-reports/cell-report-create-form-modal";
import { CellReportList } from "@/features/cell-reports/cell-report-list";
import { CellReportTable } from "@/features/cell-reports/cell-report-table";
import { CellReportsFilters } from "@/features/cell-reports/cell-reports-filters";
import { MineSwitch } from "@/features/cell-reports/mine-switch";
import {
  type CellReportsQueryArgs,
  getCellReports,
} from "@/features/cell-reports/queries";
import { ViewPDFButton } from "@/features/cell-reports/view-pdf-button";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Cell Reports",
};

interface PageProps {
  searchParams: Promise<CellReportsQueryArgs>;
}

async function CellReportsPage({ searchParams }: PageProps) {
  const pageSearchParams = await searchParams;

  const { cellReports, pageInfo, isAdmin, isPastor, dateFilter, user } =
    await getCellReports(pageSearchParams);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="font-bold">Cell Reports</h2>
          {dateFilter ? (
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <CalendarIcon className="size-3" />
              <span>
                {formatDate(dateFilter?.start?.toISOString())} -{" "}
                {formatDate(dateFilter?.end.toISOString())}
              </span>
            </div>
          ) : null}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden md:block">
            <MineSwitch />
          </div>
          <ViewPDFButton period={dateFilter} cellReports={cellReports} />
          <CellReportCreateFormModal />
        </div>
      </div>

      <div className="md:hidden">
        <MineSwitch />
      </div>

      {/* filters */}
      <CellReportsFilters />

      {/* list */}
      <CellReportList cellReports={cellReports} />

      {/* table */}
      <CellReportTable
        withLeader={isAdmin || isPastor}
        userId={user.userId}
        cellReports={cellReports}
      />
      <DataPagination
        name="cell reports"
        pageInfo={pageInfo}
        pageSizeOptions={[10, 20, 40, 50, 100]}
      />
    </div>
  );
}

export default CellReportsPage;
