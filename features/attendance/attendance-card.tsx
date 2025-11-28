import Link from "next/link";
import type { Attendance } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, removeUnderscores } from "@/lib/utils";
import { AttendanceRecordMenu } from "./attendance-record-menu";

export function AttendanceCard({
  attendanceRecord,
}: {
  attendanceRecord: Attendance & {
    _count: {
      attendees: number;
      newComers: number;
    };
  };
}) {
  return (
    <Card className="relative h-full gap-3 py-4">
      <CardHeader className="px-4">
        <Badge
          variant={attendanceRecord.type}
          className="bg-transparent p-0 text-[10px] dark:bg-transparent"
        >
          {removeUnderscores(attendanceRecord.type)}
        </Badge>

        <CardTitle>
          <Link
            href={`/attendance/${attendanceRecord.id}`}
            className="hover:underline"
          >
            {attendanceRecord.title}
          </Link>
        </CardTitle>
        <CardDescription className="text-xs">
          {formatDate(new Date(attendanceRecord.date)?.toString())}
          {attendanceRecord.tags?.at(0) ? (
            <Badge
              variant={attendanceRecord.type}
              className="ml-2 rounded text-[10px]"
            >
              {attendanceRecord.tags?.at(0)}
            </Badge>
          ) : null}
        </CardDescription>
      </CardHeader>
      <CardAction className="absolute top-1 right-1">
        <AttendanceRecordMenu
          forCard
          attendanceId={attendanceRecord.id}
          attendanceTitle={attendanceRecord.title}
        />
      </CardAction>
      <CardContent className="space-y-3 px-4">
        <div className="flex gap-2">
          {attendanceRecord._count.attendees +
            attendanceRecord._count.newComers ===
          0 ? (
            <Badge variant="NONE" className="rounded border text-[10px]">
              No attendees yet
            </Badge>
          ) : (
            <>
              <Badge variant="ACTIVE" className="rounded border text-[10px]">
                {attendanceRecord._count.attendees} attendees
              </Badge>
              {attendanceRecord._count.newComers === 0 ? null : (
                <Badge
                  variant="DISCIPLESHIP"
                  className="rounded border text-[10px]"
                >
                  {attendanceRecord._count.newComers} new comers
                </Badge>
              )}
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-end px-4">
        <Button size="sm" asChild>
          <Link href={`/attendance/${attendanceRecord.id}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
