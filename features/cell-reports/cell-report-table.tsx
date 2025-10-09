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
import type { CellReportRecord } from "@/types/globals";
import { CellReportRowActions } from "./cell-report-row-actions";

export function CellReportTable({
  withLeader,
  cellReports,
  userId,
}: {
  withLeader: boolean;
  userId?: string | null;
  cellReports: CellReportRecord[];
}) {
  return (
    <div className="hidden min-h-min flex-1 overflow-hidden rounded-md border sm:block [&>div]:rounded-md lg:[&>div]:max-h-[480px]">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-card backdrop-blur-sm">
          <TableRow className="hover:bg-transparent">
            <TableHead className="size-4 text-center">#</TableHead>
            {withLeader ? <TableHead>Network Leader</TableHead> : null}
            <TableHead>CG Leader</TableHead>
            <TableHead>
              <SortLink sortValue="type" title="Cell Type" />
            </TableHead>
            <TableHead>Lesson</TableHead>
            <TableHead>
              <SortLink sortValue="date" title="Date & Time" />
            </TableHead>
            <TableHead># Attendees</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cellReports.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={withLeader ? 8 : 7}>
                <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
                  <PackageIcon className="size-6 text-muted-foreground" />
                  <p className="text-center text-muted-foreground text-sm">
                    No cell report records found.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            cellReports.map((cellReport, index) => (
              <TableRow key={cellReport.id} className="hover:bg-transparent">
                <TableCell className="w-4 border-r text-center">
                  {index + 1}
                </TableCell>

                {withLeader ? (
                  <TableCell>
                    <div>
                      <Link
                        href={`/leaders/${cellReport.leader?.id}`}
                        className="font-semibold hover:underline"
                      >
                        {cellReport.leader?.name}
                      </Link>
                      <p className="text-muted-foreground text-xs capitalize">
                        {cellReport.leader.name === "John De Guzman"
                          ? "GCC Pastor"
                          : "Primary Leader"}
                      </p>
                    </div>
                  </TableCell>
                ) : null}

                <TableCell>
                  {cellReport.assistant ? (
                    <div>
                      <Link
                        href={`/disciples/${cellReport.assistantId}`}
                        className="font-semibold hover:underline"
                      >
                        {cellReport.assistant.name}
                      </Link>
                      <p className="text-muted-foreground text-xs capitalize">
                        Assistant Leader
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Link
                        href={`/disciples/${cellReport.leaderId}`}
                        className="font-semibold hover:underline"
                      >
                        {cellReport.leader.name}
                      </Link>
                      <p className="text-muted-foreground text-xs capitalize">
                        {userId === cellReport.leader.userAccountId
                          ? "GCC Pastor"
                          : "Primary Leader"}
                      </p>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={cellReport.type}>{cellReport.type}</Badge>
                </TableCell>

                <TableCell>
                  {cellReport.lessonTitle ? (
                    <div>
                      <p className="font-semibold">{cellReport.lessonTitle}</p>
                      <p className="text-muted-foreground text-xs">
                        Custom Lesson
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold hover:underline">
                        {cellReport.lesson?.title}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {cellReport.lesson?.lessonSeries.title}
                      </p>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-xs">
                    {cellReport.date}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="DISCIPLESHIP">
                    {cellReport.cellReportAttendeeSnapshots.length}{" "}
                    {pluralize(
                      "attendee",
                      cellReport.cellReportAttendeeSnapshots.length,
                    )}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <CellReportRowActions cellReport={cellReport} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
