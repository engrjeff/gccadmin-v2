import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const mode = searchParams.get("mode") as string;

  if (mode === "with-won-souls") {
    const assistantLeaders = await prisma.disciple.findMany({
      where: {
        isActive: true,
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        leaderId: true,
        isPrimary: true,
        isMyPrimary: true,
        _count: {
          select: {
            wonSouls: true,
          },
        },
      },
      orderBy: [{ createdAt: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(
      assistantLeaders.filter((a) => a._count.wonSouls > 0),
    );
  }

  const assistantLeaders = await prisma.disciple.findMany({
    where: {
      isActive: true,
      isDeleted: false,
      isMyPrimary: true,
    },
    select: {
      id: true,
      name: true,
      leaderId: true,
      isPrimary: true,
      isMyPrimary: true,
    },
    orderBy: [{ createdAt: "asc" }, { name: "asc" }],
  });

  return NextResponse.json(assistantLeaders);
}
