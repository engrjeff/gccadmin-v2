import type { Metadata } from "next";
import { CellGroupStatistics } from "@/features/reports/cell-group-statistics";
import { MemberStatistics } from "@/features/reports/member-statistics";
import { RecentCellGroups } from "@/features/reports/recent-cell-groups";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="space-y-4 p-4">
      <div>
        <h2 className="font-bold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Quick insights on cell groups and members.
        </p>
      </div>
      <CellGroupStatistics />
      <RecentCellGroups />
      <MemberStatistics />
    </div>
  );
}
