import { PackageIcon } from "lucide-react";
import Link from "next/link";
import pluralize from "pluralize";
import { SortLink } from "@/components/sort-link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SoulWinningReportRecord } from "@/types/globals";
import { WinAndConsoRowActions } from "./win-and-conso-row-actions";

export function ConsolidationReportsTable({
  consolidationReports,
  withLeader,
  userId,
}: {
  consolidationReports: SoulWinningReportRecord[];
  withLeader: boolean;
  userId: string;
}) {
  return (
    <div className="min-h-min flex-1 overflow-hidden rounded-md border [&>div]:rounded-md lg:[&>div]:max-h-[480px]">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-card backdrop-blur-sm">
          <TableRow className="hover:bg-transparent">
            <TableHead className="size-4 text-center">#</TableHead>
            {withLeader ? <TableHead>Network Leader</TableHead> : null}
            <TableHead>Won By</TableHead>
            <TableHead>Lesson</TableHead>
            <TableHead>
              <SortLink sortValue="date" title="Date & Time" />
            </TableHead>
            <TableHead># Won Souls</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consolidationReports.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={withLeader ? 7 : 6}>
                <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
                  <PackageIcon className="size-6 text-muted-foreground" />
                  <p className="text-center text-muted-foreground text-sm">
                    No consolidation report records found.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            consolidationReports.map((report, index) => (
              <TableRow key={report.id} className="hover:bg-transparent">
                <TableCell className="w-4 border-r text-center">
                  {index + 1}
                </TableCell>

                {withLeader ? (
                  <TableCell>
                    <div>
                      <Link
                        href={`/leaders/${report.networkLeaderId}`}
                        className="font-semibold hover:underline"
                      >
                        {report.networkLeader?.name}
                      </Link>
                      <p className="text-muted-foreground text-xs capitalize">
                        {report.networkLeader.name.includes("John De Guzman")
                          ? "GCC Pastor"
                          : "Primary Leader"}
                      </p>
                    </div>
                  </TableCell>
                ) : null}

                <TableCell>
                  {report.assistantLeader ? (
                    <div>
                      <Link
                        href={`/disciples/${report.assistantLeader.id}`}
                        className="font-semibold hover:underline"
                      >
                        {report.assistantLeader.name}
                      </Link>
                      <p className="text-muted-foreground text-xs capitalize">
                        Assistant Leader
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Link
                        href={`/disciples/${report.networkLeader.id}`}
                        className="font-semibold hover:underline"
                      >
                        {report.networkLeader.name}
                      </Link>
                      <p className="text-muted-foreground text-xs capitalize">
                        {userId === report.networkLeader.userAccountId
                          ? "GCC Pastor"
                          : "Primary Leader"}
                      </p>
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  <div>
                    <p className="font-semibold hover:underline">
                      {report.lesson?.title}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {report.lesson?.lessonSeries.title}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <p>{report.date}</p>
                  <span className="text-muted-foreground text-xs">
                    {report.venue}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="ACTIVE" className="normal-case">
                    {report.newBelievers.length}
                    {" won "}
                    {pluralize("souls", report.newBelievers.length)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <WinAndConsoRowActions
                    reportId={report.id}
                    type={report.type}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
