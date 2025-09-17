"use server";

import { auth } from "@clerk/nextjs/server";
import { cache } from "react";
import type {
  CellStatus,
  ChurchStatus,
  ProcessLevel,
} from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { getSkip } from "@/lib/utils.server";

export type DisciplesQueryArgs = {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: "asc" | "desc";
  cellStatus?: string;
  churchStatus?: string;
  processLevel?: string;
  processLevelStatus?: string;
  leaderId?: string;
  q?: string;
  status?: "active" | "inactive" | "primary";
};

const DEFAULT_PAGE_SIZE = 12;

function getDiscipleSort(sortBy?: string, order?: "asc" | "desc") {
  const defaultSort = [
    {
      isPrimary: "desc" as "asc" | "desc",
    },
    {
      name: "asc" as "asc" | "desc",
    },
    {
      createdAt: "desc" as "asc" | "desc",
    },
  ];

  if (!sortBy && !order) return defaultSort;

  const acceptedSortKeys = [
    "name",
    "cellStatus",
    "churchStatus",
    "processLevel",
    "processLevelStatus",
  ];

  if (sortBy && !acceptedSortKeys.includes(sortBy)) return defaultSort;

  return [
    {
      [sortBy as string]: order,
    },
  ];
}

export async function getDisciples(args: DisciplesQueryArgs) {
  const user = await auth();

  if (!user?.userId) throw new Error("Session not found");

  const isAdmin = user.sessionClaims.metadata.role === "admin";

  const leader = await prisma.disciple.findUnique({
    where: { userAccountId: user.userId },
  });

  if (!leader && !isAdmin) {
    return {
      disciples: [],
      user,
      isAdmin: user.sessionClaims.metadata.role === "admin",
      pageInfo: {
        total: 0,
        page: 1,
        itemCount: 0,
        pageSize: DEFAULT_PAGE_SIZE,
        totalPages: 0,
      },
    };
  }

  const cellStatusFilter = args?.cellStatus
    ? (args.cellStatus.split(",") as Array<CellStatus>)
    : undefined;

  const churchStatusFilter = args?.churchStatus
    ? (args.churchStatus.split(",") as Array<ChurchStatus>)
    : undefined;

  const processLevelFilter = args?.processLevel
    ? (args.processLevel.split(",") as Array<ProcessLevel>)
    : undefined;

  // const processLevelStatusFilter = args?.processLevelStatus
  //   ? (args.processLevelStatus.split(",") as Array<ProcessLevelStatus>)
  //   : undefined;

  const isActive = args?.status === undefined ? true : args.status === "active";

  const totalFiltered = await prisma.disciple.count({
    where: {
      leaderId: leader?.id,
      isDeleted: false,
      isActive,
      name: args.q
        ? {
            contains: args.q,
            mode: "insensitive",
          }
        : undefined,
      cellStatus: {
        in: cellStatusFilter,
      },
      churchStatus: {
        in: churchStatusFilter,
      },
      processLevel: {
        in: processLevelFilter,
      },
    },
  });

  const pageInfo = {
    total: totalFiltered,
    page: args.page ? Number(args.page) : 1,
    pageSize: DEFAULT_PAGE_SIZE,
  };

  const disciples = await prisma.disciple.findMany({
    where: {
      leaderId: leader?.id,
      isDeleted: false,
      isActive,
      name: args.q
        ? {
            contains: args.q,
            mode: "insensitive",
          }
        : undefined,
      cellStatus: {
        in: cellStatusFilter,
      },
      churchStatus: {
        in: churchStatusFilter,
      },
      processLevel: {
        in: processLevelFilter,
      },
    },
    include: {
      leader: {
        select: {
          id: true,
          name: true,
        },
      },
      handledBy: {
        select: { name: true },
      },
    },

    take: args?.pageSize ?? DEFAULT_PAGE_SIZE,
    skip: getSkip({ limit: DEFAULT_PAGE_SIZE, page: args?.page }),
    orderBy: [
      ...getDiscipleSort(args.sort, args.order),
      {
        id: "asc",
      },
    ],
  });

  return {
    disciples,
    user,
    isAdmin: user.sessionClaims.metadata.role === "admin",
    pageInfo: {
      ...pageInfo,
      itemCount: disciples.length,
      totalPages: Math.ceil(totalFiltered / DEFAULT_PAGE_SIZE),
    },
  };
}

export async function getDiscipleById(discipleId: string) {
  const disciple = await prisma.disciple.findUnique({
    where: { id: discipleId },
    include: { leader: true, handledBy: true },
  });

  return { disciple };
}

export const cachedGetDiscipleById = cache(getDiscipleById);
