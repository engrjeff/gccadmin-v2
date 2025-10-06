import { format } from "date-fns";
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/disciples/[discipleId]/lessons-taken">,
) {
  try {
    const { discipleId } = await ctx.params;

    const cellGroups = await prisma.cellReportAttendeeSnapshot.findMany({
      where: {
        discipleId,
      },
      select: {
        id: true,
        name: true,
        status: true,
        cellReport: {
          include: {
            lesson: {
              include: {
                lessonSeries: { select: { id: true, title: true } },
              },
            },
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
            cellReportAttendeeSnapshots: true,
          },
        },
      },
      orderBy: {
        cellReport: {
          date: "desc",
        },
      },
    });

    // get unique lessons
    const lessonMap = new Map();

    cellGroups.forEach((record) => {
      const lesson = record.cellReport.lesson;
      if (lesson && !lessonMap.has(lesson.id)) {
        lessonMap.set(lesson.id, lesson);
      }
    });

    const lessonsTaken = Array.from(lessonMap.values());

    return NextResponse.json({
      lessonsTaken,
      attendedCellGroups: cellGroups.map((cg) => ({
        ...cg.cellReport,
        date: format(cg.cellReport.date, "PPp"),
      })),
    });
  } catch (error) {
    console.log(
      "Error at GET /api/disciples/{discipleId}/lessons-taken",
      error,
    );
    return NextResponse.json([]);
  }
}
