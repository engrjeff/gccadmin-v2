import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const assistantLeaders = await prisma.disciple.findMany({
    where: {
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
