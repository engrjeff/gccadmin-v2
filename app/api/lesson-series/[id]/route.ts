import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const lessonSeries = await prisma.lessonSeries.findUnique({
      where: {
        id,
      },
      include: {
        lessons: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return NextResponse.json(lessonSeries);
  } catch (error) {
    console.log("Error at GET /api/lesson-series/{id}", error);
    return NextResponse.json([]);
  }
}
