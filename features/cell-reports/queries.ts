"use server";

import { auth } from "@clerk/nextjs/server";
import type { CellType } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { getDateRange, getSkip } from "@/lib/utils.server";
import type { DateRange } from "@/types/globals";

export type CellReportsQueryArgs = {
  page?: number;
  pageSize?: number;
  // sort
  sort?: string;
  order?: "asc" | "desc";
  // filters
  leader?: string;
  cellType?: CellType;
  dateRange?: DateRange;
  // showMyReportsOnly
  showMyReportsOnly?: "true" | undefined;
};

const DEFAULT_PAGE_SIZE = 10;

function getCellReportSort(sortBy?: string, order?: "asc" | "desc") {
  const defaultSort = [
    {
      date: "desc" as "asc" | "desc",
    },
  ];

  if (!sortBy && !order) return defaultSort;

  const acceptedSortKeys = ["date", "type"];

  if (sortBy && !acceptedSortKeys.includes(sortBy)) return defaultSort;

  return [
    {
      [sortBy as string]: order,
    },
  ];
}

export async function getCellReports(args: CellReportsQueryArgs) {
  const user = await auth();

  if (!user?.userId) throw new Error("Session not found");

  const isAdmin = user.sessionClaims.metadata.role === "admin";

  const isPastor = user.sessionClaims.metadata.pastor === true;

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
      cellReports: [],
      user,
      isAdmin,
      isPastor,
      dateFilter: undefined,
      pageInfo: {
        total: 0,
        page: 1,
        itemCount: 0,
        pageSize: pageSizeParam,
        totalPages: 0,
      },
    };
  }

  const cellType = args?.cellType;

  const dateFilter = args?.dateRange
    ? getDateRange(args.dateRange)
    : getDateRange("this_week"); // default to the current week

  const leaderFilter = args.leader
    ? args.leader
    : isPastor
      ? undefined
      : leader?.id;

  const totalFilteredQuery = prisma.cellReport.count({
    where: {
      leaderId: args.showMyReportsOnly === "true" ? leader?.id : leaderFilter,
      type: cellType,
      date: {
        gte: dateFilter?.start,
        lte: dateFilter?.end,
      },
    },
  });

  const cellReportsQuery = prisma.cellReport.findMany({
    where: {
      leaderId: args.showMyReportsOnly === "true" ? leader?.id : leaderFilter,
      type: cellType,
      date: {
        gte: dateFilter?.start,
        lte: dateFilter?.end,
      },
    },
    include: {
      leader: {
        select: {
          id: true,
          name: true,
          userAccountId: true,
        },
      },
      assistant: {
        select: {
          id: true,
          name: true,
        },
      },
      cellReportAttendeeSnapshots: true,
      lesson: {
        select: {
          id: true,
          title: true,
          scriptureReferences: true,
          lessonSeries: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },

    take: pageSizeParam,
    skip: getSkip({ limit: pageSizeParam, page: args?.page }),
    orderBy: [
      ...getCellReportSort(args.sort, args.order),
      {
        id: "asc",
      },
    ],
  });

  const [totalFiltered, cellReports] = await Promise.all([
    totalFilteredQuery,
    cellReportsQuery,
  ]);

  const pageInfo = {
    total: totalFiltered,
    page: args.page ? Number(args.page) : 1,
    pageSize: pageSizeParam,
  };

  return {
    cellReports,
    user,
    isAdmin,
    isPastor,
    pageInfo: {
      ...pageInfo,
      itemCount: cellReports.length,
      totalPages: Math.ceil(totalFiltered / pageSizeParam),
    },
    dateFilter,
  };
}

export type GetCellReportQueryData = Awaited<ReturnType<typeof getCellReports>>;

export type CellReportRecord = GetCellReportQueryData["cellReports"][number];
