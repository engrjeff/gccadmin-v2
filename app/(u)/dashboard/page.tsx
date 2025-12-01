import type { Metadata } from "next";
import { QuickActions } from "@/components/quick-actions";
import { CellGroupStatistics } from "@/features/reports/cell-group-statistics";
import { CellReportTrend } from "@/features/reports/cell-report-trend";
import { DashboardRefreshButton } from "@/features/reports/dashboard-refresh-button";
import { DisciplesWithCellGroups } from "@/features/reports/disciples-with-cellgroups";
import { MemberStatistics } from "@/features/reports/member-statistics";
import { MemberStatisticsByStatus } from "@/features/reports/member-statistics-by-status";
import { RecentCellGroups } from "@/features/reports/recent-cell-groups";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-bold">Dashboard</h2>
          <p className="hidden text-muted-foreground text-sm md:block">
            Quick insights on cell groups and members.
          </p>
          <p className="text-muted-foreground text-sm md:hidden">
            Quick cell group insights.
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <QuickActions />
          <DashboardRefreshButton />
        </div>
      </div>
      {/* <NoCellReportAlert /> */}
      <CellGroupStatistics />
      <CellReportTrend />
      <MemberStatisticsByStatus />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 [&>div]:h-full">
          <RecentCellGroups />
        </div>
        <div>
          <DisciplesWithCellGroups />
        </div>
      </div>

      <MemberStatistics />
    </div>
  );
}
