import { type NextRequest, NextResponse } from "next/server";
import { CellType } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year =
      searchParams.get("year") || new Date().getFullYear().toString();

    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31T23:59:59`);

    const cellReports = await prisma.cellReport.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        type: true,
        date: true,
      },
    });

    const monthlyData = Array.from({ length: 12 }, (_, index) => {
      const month = new Date(2024, index, 1).toLocaleDateString("en-US", {
        month: "long",
      });

      const monthReports = cellReports.filter((report) => {
        const reportMonth = report.date.getMonth();
        return reportMonth === index;
      });

      // if (monthReports.length === 0) {
      //   return null;
      // }

      const discipleshipCount = monthReports.filter(
        (report) => report.type === CellType.DISCIPLESHIP,
      ).length;

      const soulwinningCount = monthReports.filter(
        (report) => report.type === CellType.SOULWINNING,
      ).length;

      const openCount = monthReports.filter(
        (report) => report.type === CellType.OPEN,
      ).length;

      return {
        month,
        discipleship: discipleshipCount,
        soulwinning: soulwinningCount,
        open: openCount,
      };
    });

    return NextResponse.json({
      data: monthlyData,
      year: parseInt(year, 10),
    });
  } catch (error) {
    console.error("Error fetching cell report trend:", error);
    return NextResponse.json(
      { error: "Failed to fetch cell report trend data" },
      { status: 500 },
    );
  }
}
