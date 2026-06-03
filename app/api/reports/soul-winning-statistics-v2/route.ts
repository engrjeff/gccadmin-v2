import { NextResponse } from "next/server";
import { SoulWinningReportType } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const year = new Date().getFullYear();
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31T23:59:59`);

    const dateFilter = {
      gte: startDate,
      lte: endDate,
    };

    const [soulWinningSessions, consolidationSessions, newBelievers] =
      await Promise.all([
        prisma.soulWinningReport.count({
          where: { type: SoulWinningReportType.SOUL_WINNING, date: dateFilter },
        }),
        prisma.soulWinningReport.count({
          where: {
            type: SoulWinningReportType.CONSOLIDATION,
            date: dateFilter,
          },
        }),
        prisma.newBeliever.count(),
      ]);

    return NextResponse.json({
      soulWinningSessions,
      consolidationSessions,
      newBelievers,
    });
  } catch (error) {
    console.log(
      "Error at GET /api/reports/soul-winning-statistics-v2",
      error,
    );
    return NextResponse.json({
      soulWinningSessions: 0,
      consolidationSessions: 0,
      newBelievers: 0,
    });
  }
}
