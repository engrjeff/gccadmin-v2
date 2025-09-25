import type { Metadata } from "next";
import { QuickActions } from "@/components/quick-actions";
import { CellGroupStatistics } from "@/features/reports/cell-group-statistics";
import { CellReportTrend } from "@/features/reports/cell-report-trend";
import { MemberStatistics } from "@/features/reports/member-statistics";
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
          <p className="text-sm hidden md:block text-muted-foreground">
            Quick insights on cell groups and members.
          </p>
          <p className="text-sm md:hidden text-muted-foreground">
            Quick cell group insights.
          </p>
        </div>
        <QuickActions />
      </div>

      <CellGroupStatistics />
      <CellReportTrend />
      <RecentCellGroups />
      <MemberStatistics />
    </div>
  );
}
