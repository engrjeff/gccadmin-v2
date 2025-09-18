import type { Metadata } from "next";
import { DataPagination } from "@/components/data-pagination";
import { CellReportCreateFormModal } from "@/features/cell-reports/cell-report-create-form-modal";
import { CellReportTable } from "@/features/cell-reports/cell-report-table";
import { CellReportsFilters } from "@/features/cell-reports/cell-reports-filters";
import {
  type CellReportsQueryArgs,
  getCellReports,
} from "@/features/cell-reports/queries";

export const metadata: Metadata = {
  title: "Cell Reports",
};

interface PageProps {
  searchParams: Promise<CellReportsQueryArgs>;
}

async function CellReportsPage({ searchParams }: PageProps) {
  const pageSearchParams = await searchParams;

  const { cellReports, pageInfo, isAdmin } =
    await getCellReports(pageSearchParams);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <h2 className="font-bold">Cell Reports</h2>
        <div className="flex items-center gap-3 ml-auto">
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
