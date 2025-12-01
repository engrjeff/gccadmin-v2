import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/attendance/[id]">,
) {
  try {
    const { id } = await ctx.params;

    const attendance = await prisma.attendance.findUnique({
      where: {
        id,
      },
      include: {
        attendees: true,
        newComers: true,
      },
    });

    return NextResponse.json({ attendance });
  } catch (error) {
    console.log("Error at GET /api/attendance/[id]", error);
    return NextResponse.json({ attendance: null });
  }
}
