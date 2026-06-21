import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_request: NextRequest) {
  try {
    const newComers = await prisma.newComer.findMany({
      include: {
        invitedBy: {
          select: {
            id: true,
            name: true,
            leader: { select: { id: true, name: true } },
          },
        },
        attendances: { select: { _count: true } },
      },
    });

    return NextResponse.json(newComers ?? []);
  } catch (error) {
    console.log("Error at GET /api/attendance/new-attendees", error);
    return NextResponse.json([]);
  }
}
