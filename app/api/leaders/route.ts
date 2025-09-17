import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const leaders = await prisma.disciple.findMany({
    where: { isPrimary: true },
    include: { userAccount: true },
    orderBy: [{ createdAt: "asc" }, { name: "asc" }],
  });

  return NextResponse.json(leaders);
}
