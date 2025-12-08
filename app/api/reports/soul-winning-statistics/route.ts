import { NextResponse } from "next/server";
import { CellStatus, CellType, ChurchStatus } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // get the cell reports of type soul-winning
    const year = new Date().getFullYear();
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31T23:59:59`);

    const cellReports = await prisma.cellReport.findMany({
      where: {
        type: CellType.SOULWINNING,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        type: true,
        date: true,
        cellReportAttendeeSnapshots: {
          select: { id: true },
        },
      },
    });

    // collect the unique attendees which are 1st timers in CG
    const newlyWonSouls = cellReports.flatMap((report) =>
      report.cellReportAttendeeSnapshots.map((a) => a.id),
    );

    // find the disciples who are now 2nd-timer and up having id in newlyWonSouls
    // these are the consolidated ones
    const consolidatedSoulsQuery = prisma.disciple.findMany({
      where: {
        cellStatus: { not: CellStatus.FIRST_TIMER },
        id: { in: newlyWonSouls },
      },
    });

    // find the disciples who are now ACS or Regular in church
    const attendedChurchSoulsQuery = prisma.disciple.findMany({
      where: {
        churchStatus: { not: ChurchStatus.NACS },
        id: { in: newlyWonSouls },
      },
    });

    const [consolidatedSouls, attendedChurchSouls] = await Promise.all([
      consolidatedSoulsQuery,
      attendedChurchSoulsQuery,
    ]);

    return NextResponse.json({
      wonSouls: newlyWonSouls.length,
      consolidatedSouls: consolidatedSouls.length,
      attendedChurchSouls: attendedChurchSouls.length,
    });
  } catch (error) {
    console.log("Error at GET /api/reports/soul-winning-statistics", error);
    return NextResponse.json({
      wonSouls: 0,
      consolidatedSouls: 0,
      attendedChurchSouls: 0,
    });
  }
}
