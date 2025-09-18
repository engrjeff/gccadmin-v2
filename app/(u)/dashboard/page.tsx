import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CellGroupStatistics } from "@/features/reports/cell-group-statistics";
import { MemberStatisticsByCellStatus } from "@/features/reports/member-statistics-by-cell-status";
import { MemberStatisticsByChurchStatus } from "@/features/reports/member-statistics-by-church-status";
import { MemberStatisticsByType } from "@/features/reports/member-statistics-by-type";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="mb-1 text-lg font-bold tracking-tight">Dashboard</h2>
      </div>
      <Separator />
      <CellGroupStatistics />

      <Card className="py-4 gap-0">
        <CardHeader className="border-b px-4 [.border-b]:pb-4">
          <CardTitle>Member Statistics</CardTitle>
          <CardDescription>As of today</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 [&>div]:p-4">
            <MemberStatisticsByType />
            <MemberStatisticsByCellStatus />
            <MemberStatisticsByChurchStatus />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
