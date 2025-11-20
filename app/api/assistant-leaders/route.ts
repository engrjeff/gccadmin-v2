import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const assistantLeaders = await prisma.disciple.findMany({
    where: {
      isMyPrimary: true,
      handledDisciples: {
        some: {},
      },
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: [{ createdAt: "asc" }, { name: "asc" }],
  });

  return NextResponse.json(assistantLeaders);
}
