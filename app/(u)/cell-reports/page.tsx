import { CalendarIcon } from "lucide-react";
import type { Metadata } from "next";
import { DataPagination } from "@/components/data-pagination";
import { CellReportCreateFormModal } from "@/features/cell-reports/cell-report-create-form-modal";
import { CellReportTable } from "@/features/cell-reports/cell-report-table";
import { CellReportsFilters } from "@/features/cell-reports/cell-reports-filters";
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

  const { cellReports, pageInfo, isAdmin, dateFilter } =
    await getCellReports(pageSearchParams);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="font-bold">Cell Reports</h2>
          {dateFilter ? (
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <CalendarIcon className="size-3" />
              <span>
                {formatDate(dateFilter?.start?.toISOString())} -
                {formatDate(dateFilter?.end.toISOString())}
              </span>
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <ViewPDFButton period={dateFilter} cellReports={cellReports} />
          <CellReportCreateFormModal />
        </div>
      </div>

      {/* filters */}
      <CellReportsFilters />

      {/* table */}
      <CellReportTable isAdmin={isAdmin} cellReports={cellReports} />
      <DataPagination name="cell reports" pageInfo={pageInfo} />
    </div>
  );
}

export default CellReportsPage;
