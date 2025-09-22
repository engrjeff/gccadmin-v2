import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams;

    const dateRangeStart = query.get("dateRangeStart") as string;
    const dateRangeEnd = query.get("dateRangeEnd") as string;

    const cellReports = await prisma.cellReport.findMany({
      where: {
        date: {
          gte: new Date(dateRangeStart),
          lte: new Date(dateRangeEnd),
        },
      },
      include: {
        leader: {
          select: {
            id: true,
            name: true,
          },
        },
        assistant: {
          select: {
            id: true,
            name: true,
          },
        },
        lesson: {
          include: {
            lessonSeries: true,
          },
        },
        cellReportAttendeeSnapshots: true,
      },
      orderBy: [
        {
          date: "asc",
        },
        {
          id: "asc",
        },
      ],
    });

    return NextResponse.json({
      cellReports,
      dateRangeFilter: { start: dateRangeStart, end: dateRangeEnd },
    });
  } catch (error) {
    console.log(`Error in GET /api/reports/cell-group-statistics: `, error);
    return NextResponse.json(null);
  }
}
