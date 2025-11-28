import { type NextRequest, NextResponse } from "next/server";
import type { MemberType } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const currentAttendanceId = searchParams.get(
      "currentAttendanceId",
    ) as string;

    const memberType = searchParams.get("memberType") as MemberType;

    const q = searchParams.get("q");

    // get the target attendance
    // the returnees are the data with attendanceId !== attendance.id
    // and attendedAt < attendance.date
    const currentAttendance = await prisma.attendance.findUnique({
      where: { id: currentAttendanceId },
    });

    const returnees = await prisma.newComer.findMany({
      where: {
        OR: [
          {
            attendances: {
              some: {
                id: {
                  not: currentAttendanceId,
                },
              },
            },
          },
          {
            attendances: {
              every: {
                id: currentAttendanceId,
              },
            },
          },
        ],
        attendedAt: {
          lte: currentAttendance?.date,
        },
        memberType: memberType ?? undefined,
        name: q
          ? {
              contains: q,
              mode: "insensitive",
            }
          : undefined,
      },
      include: { attendances: { select: { id: true } } },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      label: "Returnees",
      members: returnees,
    });
  } catch (error) {
    console.log("Error at GET /api/attendance/returnees", error);
    return NextResponse.json({
      label: "Returnees",
      members: [],
    });
  }
}
