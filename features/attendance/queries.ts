"use server";

import type { AttendanceType } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

export type GetAttendanceRecordsQueryArgs = {
  type: AttendanceType;
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: "asc" | "desc";
};

export async function getAttendanceRecords(
  args: GetAttendanceRecordsQueryArgs,
) {
  const attendanceRecords = await prisma.attendance.findMany({
    where: {
      type: args.type,
      title: args.q
        ? {
            contains: args.q,
            mode: "insensitive",
          }
        : undefined,
    },
    include: {
      _count: {
        select: { attendees: true, newComers: true },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return { attendanceRecords };
}

export async function getAttendanceRecordById(id: string) {
  const attendanceRecord = await prisma.attendance.findUnique({
    where: {
      id,
    },
    include: {
      attendees: {
        select: {
          id: true,
        },
      },
      newComers: {
        include: {
          attendances: {
            select: { id: true },
          },
        },
      },
    },
  });

  return { attendanceRecord };
}
