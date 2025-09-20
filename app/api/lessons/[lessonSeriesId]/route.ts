import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lessonSeriesId: string }> },
) {
  const { lessonSeriesId } = await params;

  try {
    const lessonSeriesList = await prisma.lesson.findMany({
      where: {
        lessonSeriesId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(lessonSeriesList);
  } catch (error) {
    console.log("Error at GET /api/lessons", error);
    return NextResponse.json([]);
  }
}
