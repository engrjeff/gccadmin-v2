import Link from "next/link";
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
import { CellStatusBadge } from "../disciples/cell-status-badge";
import { ChurchStatusBadge } from "../disciples/church-status-badge";
import type { CellReportRecord } from "./queries";

export function CellReportDetails({
  cellReport,
}: {
  cellReport: CellReportRecord;
}) {
  return (
    <div className="divide-y">
      <div className="px-4 py-2 text-sm">
        <p className="font-semibold">Leader</p>
        <p className="text-muted-foreground">{cellReport.leader.name}</p>
      </div>
      {cellReport.assistantId ? (
        <div className="px-4 py-2 text-sm">
          <p className="font-semibold">Assistant Leader</p>
          <p className="text-muted-foreground">{cellReport.assistant?.name}</p>
        </div>
      ) : null}
      <div className="px-4 py-2 text-sm">
        <p className="font-semibold">Venue</p>
        <p className="text-muted-foreground">{cellReport.venue}</p>
      </div>
      <div className="px-4 py-2 text-sm">
        <p className="font-semibold">Date</p>
        <p className="text-muted-foreground">
          {formatCellGroupDate(cellReport.date)}
        </p>
      </div>
      <div className="px-4 py-2 text-sm">
        <p className="font-semibold">Lesson</p>
        <p className="text-muted-foreground">
          {cellReport.lessonTitle
            ? cellReport.lessonTitle
            : cellReport.lesson?.title}
        </p>
      </div>
      <div className="space-y-2 px-4 py-2 text-sm">
        <p className="font-semibold">Scripture References</p>
        <div className="flex flex-wrap gap-2">
          {cellReport.scriptureReferences.length
            ? cellReport.scriptureReferences.map((sc, i) => (
                <Badge
                  key={`scripture-ref-${sc}-${i.toString()}`}
                  variant="NONE"
                >
                  {sc}
                </Badge>
              ))
            : cellReport.lesson?.scriptureReferences?.map((sc, i) => (
                <Badge
                  key={`lesson-scripture-ref-${sc}-${i.toString()}`}
                  variant="NONE"
                >
                  {sc}
                </Badge>
              ))}
        </div>
      </div>

      <div className="px-4 py-2 text-sm">
        <p className="mb-2 font-semibold">Attendees</p>
        <div>
          <Table>
            <TableHeader className="bg-card sticky top-0 z-10 backdrop-blur-sm">
              <TableRow className="hover:bg-transparent">
                <TableHead className="size-4">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Cell Status</TableHead>
                <TableHead>Church Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cellReport.cellReportAttendeeSnapshots.map((attendee, index) => (
                <TableRow
                  key={`attendee-row-${attendee.id}`}
                  className="hover:bg-transparent"
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Link
                      href={`/disciples/${attendee.id}`}
                      className="font-semibold hover:underline"
                    >
                      {attendee.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <CellStatusBadge cellStatus={attendee.status} />
                  </TableCell>
                  <TableCell>
                    <ChurchStatusBadge churchStatus={attendee.churchStatus} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {cellReport.worship.length ? (
        <div className="px-4 py-2 text-sm">
          <p className="font-semibold">Worship</p>
          <p className="text-muted-foreground">
            {cellReport.worship.join(", ")}
          </p>
        </div>
      ) : null}

      {cellReport.work.length ? (
        <div className="px-4 py-2 text-sm">
          <p className="font-semibold">Work</p>
          <p className="text-muted-foreground">{cellReport.work.join(", ")}</p>
        </div>
      ) : null}
    </div>
  );
}
