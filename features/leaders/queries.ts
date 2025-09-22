"use server";

import prisma from "@/lib/prisma";

export type LeadersQueryArgs = {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: "asc" | "desc";
  q?: string;
};

export async function getLeaders(args: LeadersQueryArgs) {
  const leaders = await prisma.disciple.findMany({
    where: {
      isPrimary: true,
      name: args.q
        ? {
            contains: args.q,
            mode: "insensitive",
          }
        : undefined,
    },
    include: {
      userAccount: true,
      _count: {
        select: {
          disciples: {
            where: { isActive: true, isDeleted: false },
          },
        },
      },
    },
    orderBy: [{ createdAt: "asc" }, { name: "asc" }],
  });

  leaders.sort((a) => (a.userAccount ? -1 : 1));

  return leaders;
}

export async function getLeaderById(leaderId: string) {
  const leader = await prisma.disciple.findUnique({
    where: { id: leaderId },
    include: {
      userAccount: true,
    },
  });

  return leader;
}
