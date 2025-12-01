import Link from "next/link";
import type { Attendance } from "@/app/generated/prisma";
import { SortLink } from "@/components/sort-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  attendanceRecords: Array<
    Attendance & {
      _count: {
        attendees: number;
        newComers: number;
      };
    }
  >;
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
              <TableCell>
                <div className="flex gap-2">
                  {attendance._count.attendees + attendance._count.newComers ===
                  0 ? (
                    <Badge variant="NONE">No attendees yet</Badge>
                  ) : (
                    <>
                      <Badge variant="ACTIVE">
                        {attendance._count.attendees} Attendees
                      </Badge>
                      {attendance._count.newComers === 0 ? null : (
                        <Badge variant="DISCIPLESHIP">
                          {attendance._count.newComers} New Comers
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="link"
                  size="sm"
                  className="text-blue-500"
                  asChild
                >
                  <Link href={`/attendance/${attendance.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
