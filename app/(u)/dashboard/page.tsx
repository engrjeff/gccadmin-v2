import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CellGroupStatistics } from "@/features/reports/cell-group-statistics";
import { MemberStatisticsByCellStatus } from "@/features/reports/member-statistics-by-cell-status";
import { MemberStatisticsByChurchStatus } from "@/features/reports/member-statistics-by-church-status";
import { MemberStatisticsByType } from "@/features/reports/member-statistics-by-type";
import { RecentCellGroups } from "@/features/reports/recent-cell-groups";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="space-y-4 p-4">
      <div>
        <h2 className="mb-1 text-lg font-bold tracking-tight">Dashboard</h2>
      </div>
      <CellGroupStatistics />
      <RecentCellGroups />
      <Card className="py-4 gap-0">
        <CardHeader className="border-b px-4 [.border-b]:pb-4">
          <CardTitle>Member Statistics</CardTitle>
          <CardDescription>As of today</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3 [&>div]:p-4">
            <MemberStatisticsByType />
            <MemberStatisticsByCellStatus />
            <MemberStatisticsByChurchStatus />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
