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
import { formatCellGroupDate } from "@/lib/utils";
import { CellReportRowActions } from "./cell-report-row-actions";
import type { CellReportRecord } from "./queries";

export function CellReportTable({
  isAdmin,
  cellReports,
}: {
  isAdmin: boolean;
  cellReports: CellReportRecord[];
}) {
  return (
    <div className="[&>div]:rounded-md rounded-md border flex-1 min-h-min overflow-hidden lg:[&>div]:max-h-[500px]">
      <Table>
        <TableHeader className="bg-card sticky top-0 z-10 backdrop-blur-sm">
          <TableRow className="hover:bg-transparent">
            <TableHead className="size-4 text-center">#</TableHead>
            {isAdmin ? <TableHead>Network Leader</TableHead> : null}
            <TableHead>CG Leader</TableHead>
            <TableHead>
              <SortLink sortValue="type" title="Cell Type" />
            </TableHead>
            <TableHead>
              <SortLink sortValue="date" title="Date & Time" />
            </TableHead>
            <TableHead>Lesson</TableHead>
            <TableHead># Attendees</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cellReports.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={isAdmin ? 8 : 7}>
                <div className="min-h-[300px] flex flex-col items-center justify-center gap-3">
                  <PackageIcon className="size-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center">
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

                {isAdmin ? (
                  <TableCell>
                    <Link
                      href={`/leaders/${cellReport.leader?.id}`}
                      className="hover:underline"
                    >
                      {cellReport.leader?.name}
                    </Link>
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
                      <p className="text-xs text-muted-foreground capitalize">
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
                      <p className="text-xs text-muted-foreground capitalize">
                        Primary Leader
                      </p>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={cellReport.type}>{cellReport.type}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-xs">
                    {formatCellGroupDate(cellReport.date)}
                  </span>
                </TableCell>
                <TableCell>
                  {cellReport.lessonTitle ? (
                    <div>
                      <p className="font-semibold">{cellReport.lessonTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        Custom Lesson
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold hover:underline">
                        {cellReport.lesson?.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {cellReport.lesson?.lessonSeries.title}
                      </p>
                    </div>
                  )}
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
