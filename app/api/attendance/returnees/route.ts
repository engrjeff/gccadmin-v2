import { format } from "date-fns";
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
      include: {
        newComers: {
          where: {
            attendances: {
              every: {
                id: currentAttendanceId,
              },
            },
          },
        },
      },
    });

    // find orginal new comers for this attendance
    const originalNewComersIds = currentAttendance?.newComers.map(
      (nc) => nc.id,
    );

    const returnees = await prisma.newComer.findMany({
      where: {
        id: {
          notIn: originalNewComersIds,
        },
        attendedAt: {
          lt: currentAttendance?.date,
        },
        memberType: memberType ?? undefined,
        name: q
          ? {
              contains: q,
              mode: "insensitive",
            }
          : undefined,
      },
      include: {
        invitedBy: { select: { id: true, name: true } },
        attendances: { select: { id: true } },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({
      label: "Returnees",
      members: returnees.map((r) => ({
        ...r,
        firstAttendance: format(r.attendedAt, "PP"),
      })),
    });
  } catch (error) {
    console.log("Error at GET /api/attendance/returnees", error);
    return NextResponse.json({
      label: "Returnees",
      members: [],
    });
  }
}
