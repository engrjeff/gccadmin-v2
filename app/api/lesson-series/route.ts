import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const lessonSeriesList = await prisma.lessonSeries.findMany({
      include: {
        lessons: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(lessonSeriesList);
  } catch (error) {
    console.log("Error at GET /api/lesson-series", error);
    return NextResponse.json([]);
  }
}
