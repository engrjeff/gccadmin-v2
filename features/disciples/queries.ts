"use server";

import { auth } from "@clerk/nextjs/server";
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
  if (!sortBy && !order)
    return {
      name: "asc" as "asc" | "desc",
    };

  const acceptedSortKeys = [
    "name",
    "cellStatus",
    "churchStatus",
    "processLevel",
    "processLevelStatus",
  ];

  if (sortBy && !acceptedSortKeys.includes(sortBy))
    return { name: order ?? "asc" };

  const sortByValue = sortBy ? sortBy : "name";
  const sortOrderValue = order ? order : "asc";

  return {
    [sortByValue]: sortOrderValue,
  };
}

export async function getDisciples(args: DisciplesQueryArgs) {
  const user = await auth();

  if (!user?.userId) throw new Error("Session not found");

  const leader = await prisma.disciple.findUnique({
    where: { userAccountId: user.userId },
  });

  if (!leader) {
    return {
      disciples: [],
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

  const isActive =
    args?.status === undefined ? undefined : args.status === "active";

  const totalFiltered = await prisma.disciple.count({
    where: {
      leaderId: leader.id,
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
      leaderId: leader.id,
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
          name: true,
        },
      },
      handledBy: {
        select: { name: true },
      },
    },

    take: args?.pageSize ?? DEFAULT_PAGE_SIZE,
    skip: getSkip({ limit: DEFAULT_PAGE_SIZE, page: args?.page }),

    orderBy: getDiscipleSort(args.sort, args.order),
  });

  return {
    disciples,
    pageInfo: {
      ...pageInfo,
      itemCount: disciples.length,
      totalPages: Math.ceil(totalFiltered / DEFAULT_PAGE_SIZE),
    },
  };
}
