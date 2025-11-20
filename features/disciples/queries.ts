"use server";

import { auth } from "@clerk/nextjs/server";
import { cache } from "react";
import type {
  CellStatus,
  ChurchStatus,
  MemberType,
  ProcessLevel,
} from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { getSkip } from "@/lib/utils.server";

export type DisciplesQueryArgs = {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: "asc" | "desc";
  memberType?: string;
  cellStatus?: string;
  churchStatus?: string;
  processLevel?: string;
  processLevelStatus?: string;
  leader?: string;
  handledby?: string;
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
    "memberType",
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

function getStatusFilter(status: DisciplesQueryArgs["status"]) {
  if (!status)
    return {
      isActive: true,
    };

  if (status === "active")
    return {
      isActive: true,
    };

  if (status === "inactive")
    return {
      isActive: false,
    };

  if (status === "primary")
    return {
      isActive: true,
      OR: [{ isPrimary: true }, { isMyPrimary: true }],
    };
}

export async function getDisciples(args: DisciplesQueryArgs) {
  const user = await auth();

  if (!user?.userId) throw new Error("Session not found");

  const isAdmin = user.sessionClaims.metadata.role === "admin";

  const leader = await prisma.disciple.findUnique({
    where: { userAccountId: user.userId },
  });

  const pageSizeParam = args.pageSize
    ? // biome-ignore lint/suspicious/noGlobalIsNan: <nah>
      isNaN(args.pageSize)
      ? DEFAULT_PAGE_SIZE
      : Number(args.pageSize)
    : DEFAULT_PAGE_SIZE;

  if (!leader && !isAdmin) {
    return {
      disciples: [],
      user,
      isAdmin: user.sessionClaims.metadata.role === "admin",
      pageInfo: {
        total: 0,
        page: 1,
        itemCount: 0,
        pageSize: pageSizeParam,
        totalPages: 0,
      },
    };
  }

  const cellStatusFilter = args?.cellStatus
    ? (args.cellStatus.split(",") as Array<CellStatus>)
    : undefined;

  const memberTypeFilter = args?.memberType
    ? (args.memberType.split(",") as Array<MemberType>)
    : undefined;

  const churchStatusFilter = args?.churchStatus
    ? (args.churchStatus.split(",") as Array<ChurchStatus>)
    : undefined;

  const processLevelFilter = args?.processLevel
    ? (args.processLevel.split(",") as Array<ProcessLevel>)
    : undefined;

  const totalFilteredQuery = prisma.disciple.count({
    where: {
      leaderId: args.leader ? args.leader : leader?.id,
      isDeleted: false,
      ...getStatusFilter(args.status),
      name: args.q
        ? {
            contains: args.q,
            mode: "insensitive",
          }
        : undefined,
      memberType: {
        in: memberTypeFilter,
      },
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

  const disciplesQuery = prisma.disciple.findMany({
    where: {
      leaderId: args.leader ? args.leader : leader?.id,
      handledById: args.handledby ? args.handledby : undefined,
      isDeleted: false,
      ...getStatusFilter(args.status),
      name: args.q
        ? {
            contains: args.q,
            mode: "insensitive",
          }
        : undefined,
      memberType: {
        in: memberTypeFilter,
      },
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
        select: { id: true, name: true },
      },
    },

    take: pageSizeParam,
    skip: getSkip({ limit: pageSizeParam, page: args?.page }),
    orderBy: [
      ...getDiscipleSort(args.sort, args.order),
      {
        id: "asc",
      },
    ],
  });

  const [totalFiltered, disciples] = await Promise.all([
    totalFilteredQuery,
    disciplesQuery,
  ]);

  const pageInfo = {
    total: totalFiltered,
    page: args.page ? Number(args.page) : 1,
    pageSize: pageSizeParam,
  };

  return {
    disciples,
    user,
    isAdmin: user.sessionClaims.metadata.role === "admin",
    pageInfo: {
      ...pageInfo,
      itemCount: disciples.length,
      totalPages: Math.ceil(totalFiltered / pageSizeParam),
    },
  };
}

export async function getDiscipleById(discipleId: string) {
  const disciple = await prisma.disciple.findUnique({
    where: { id: discipleId },
    include: {
      leader: true,
      handledBy: true,
      disciples: true,
      handledDisciples: true,
    },
  });

  return { disciple };
}

export const cachedGetDiscipleById = cache(getDiscipleById);

export async function getDiscipleProfile() {
  const user = await auth();

  if (!user?.userId) return { discipleProfile: null };

  const discipleProfile = await prisma.disciple.findUnique({
    where: { userAccountId: user.userId },
    include: { userAccount: true },
  });

  return { discipleProfile };
}
