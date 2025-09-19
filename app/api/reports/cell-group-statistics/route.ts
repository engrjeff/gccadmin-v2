import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getDateRange } from "@/lib/utils.server";
import type { DateRange } from "@/types/globals";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams;

    const dateRange = (query.get("dateRange") as DateRange) ?? "this_week";

    const dateRangeFilter = getDateRange(dateRange);

    const cellReports = await prisma.cellReport.findMany({
      where: {
        date: {
          gte: dateRangeFilter?.start,
          lte: dateRangeFilter?.end,
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

    return NextResponse.json({ cellReports, dateRangeFilter });
  } catch (error) {
    console.log(`Error in GET /api/reports/cell-group-statistics: `, error);
    return NextResponse.json(null);
  }
}
