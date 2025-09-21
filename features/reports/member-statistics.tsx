import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MemberStatisticsByCellStatus } from "./member-statistics-by-cell-status";
import { MemberStatisticsByChurchStatus } from "./member-statistics-by-church-status";
import { MemberStatisticsByType } from "./member-statistics-by-type";

export function MemberStatistics() {
  return (
    <Card className="py-4 gap-0">
      <CardHeader className="border-b px-4 [.border-b]:pb-4">
        <CardTitle>Member Statistics</CardTitle>
        <CardDescription>As of today</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3 [&>div]:p-4">
          <MemberStatisticsByType />
          <MemberStatisticsByCellStatus />
          <MemberStatisticsByChurchStatus />
        </div>
      </CardContent>
    </Card>
  );
}
