"use server";

import prisma from "@/lib/prisma";

export async function getLeaders() {
  const leaders = await prisma.disciple.findMany({
    where: { isPrimary: true },
    include: { userAccount: true },
    orderBy: [{ createdAt: "asc" }, { name: "asc" }],
  });

  return leaders;
}

export async function getLeaderById(leaderId: string) {
  const leader = await prisma.disciple.findUnique({
    where: { id: leaderId },
    include: { userAccount: true },
  });

  return leader;
}
