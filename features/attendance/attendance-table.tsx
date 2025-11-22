import Link from "next/link";
import type { Attendance } from "@/app/generated/prisma";
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
import { removeUnderscores } from "@/lib/utils";

export function AttendanceTable({
  attendanceRecords,
}: {
  attendanceRecords: Attendance[];
}) {
  return (
    <div className="rounded-md border text-sm">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-card backdrop-blur-sm">
          <TableRow className="hover:bg-transparent">
            <TableHead>Title</TableHead>
            <TableHead>
              <SortLink
                sortValue="type"
                title="Type"
                className="justify-center"
              />
            </TableHead>
            <TableHead>
              <SortLink
                sortValue="date"
                title="Date"
                className="justify-center"
              />
            </TableHead>
            <TableHead># Attendees</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendanceRecords.map((attendance) => (
            <TableRow key={attendance.id} className="hover:bg-transparent">
              <TableCell>
                <Link
                  href={`/attendance/${attendance.id}`}
                  className="font-semibold hover:underline"
                >
                  {attendance.title}
                </Link>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={attendance.type}>
                  {removeUnderscores(attendance.type)}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                {new Date(attendance.date).toLocaleDateString()}
              </TableCell>
              <TableCell>100</TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
