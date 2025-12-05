"use server";

import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import type { MemberType, SoulWinningReportType } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { getDateRange, getSkip } from "@/lib/utils.server";
import type { DateRange } from "@/types/globals";

export type SoulWinningReportsQueryArgs = {
  page?: number;
  pageSize?: number;
  // sort
  sort?: string;
  order?: "asc" | "desc";
  // filters
  type?: SoulWinningReportType;
  leader?: string;
  assistant?: string;
  dateRange?: DateRange;
};

const DEFAULT_PAGE_SIZE = 10;

function getSort(sortBy?: string, order?: "asc" | "desc") {
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

export async function getSoulWinningReports(args: SoulWinningReportsQueryArgs) {
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
      soulWinningReports: [],
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

  const rawDateFilter = args?.dateRange
    ? getDateRange(args.dateRange)
    : undefined;

  const dateFilterStart = rawDateFilter
    ? new Date(format(rawDateFilter?.start as Date, "yyyy-MM-dd"))
    : undefined;

  const dateFilterEnd = rawDateFilter
    ? new Date(
        `${format(rawDateFilter?.end as Date, "yyyy-MM-dd")}T23:59:59.999Z`,
      )
    : undefined;

  const leaderFilter = args.leader ? args.leader : undefined;

  const totalFilteredQuery = prisma.soulWinningReport.count({
    where: {
      networkLeaderId: leaderFilter,
      type: args.type,
      assistantLeaderId: args.assistant ? args.assistant : undefined,
      date: !rawDateFilter
        ? undefined
        : {
            gte: dateFilterStart,
            lte: dateFilterEnd,
          },
    },
  });

  const soulWinningReportsQuery = prisma.soulWinningReport.findMany({
    where: {
      networkLeaderId: leaderFilter,
      type: args.type,
      assistantLeaderId: args.assistant ? args.assistant : undefined,
      date: {
        gte: dateFilterStart,
        lte: dateFilterEnd,
      },
    },
    include: {
      networkLeader: {
        select: {
          id: true,
          name: true,
          userAccountId: true,
        },
      },
      assistantLeader: {
        select: {
          id: true,
          name: true,
          isMyPrimary: true,
          isPrimary: true,
        },
      },
      newBelievers: true,
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
      ...getSort(args.sort, args.order),
      {
        id: "asc",
      },
    ],
  });

  const [totalFiltered, soulWinningReports] = await Promise.all([
    totalFilteredQuery,
    soulWinningReportsQuery,
  ]);

  const pageInfo = {
    total: totalFiltered,
    page: args.page ? Number(args.page) : 1,
    pageSize: pageSizeParam,
  };

  return {
    soulWinningReports: soulWinningReports.map((report) => ({
      ...report,
      date: format(report.date, "PPp"),
      rawDate: report.date,
    })),
    user,
    isAdmin,
    isPastor,
    pageInfo: {
      ...pageInfo,
      itemCount: soulWinningReports.length,
      totalPages: Math.ceil(totalFiltered / pageSizeParam),
    },
    dateFilter: {
      start: dateFilterStart,
      end: dateFilterEnd,
    },
  };
}

export type GetSoulWinningReportQueryData = Awaited<
  ReturnType<typeof getSoulWinningReports>
>;

// new believers
export type NewBelieversQueryArgs = {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: "asc" | "desc";
  memberType?: string;
  leader?: string;
  wonBy?: string;
  q?: string;
  soulWinningReportId?: string; // for when Track is clicked
  lessonView?: "soul-winning" | "consolidation";
};

function getNewBelieversSort(sortBy?: string, order?: "asc" | "desc") {
  const defaultSort = [
    {
      name: "asc" as "asc" | "desc",
    },
    {
      createdAt: "desc" as "asc" | "desc",
    },
  ];

  if (!sortBy && !order) return defaultSort;

  const acceptedSortKeys = ["name", "memberType"];

  if (sortBy && !acceptedSortKeys.includes(sortBy)) return defaultSort;

  return [
    {
      [sortBy as string]: order,
    },
  ];
}

export async function getNewBelievers(args: NewBelieversQueryArgs) {
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
      lessons: [],
      newBelievers: [],
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

  const memberTypeFilter = args?.memberType
    ? (args.memberType.split(",") as Array<MemberType>)
    : undefined;

  const totalFilteredQuery = prisma.newBeliever.count({
    where: {
      networkLeaderId: args.leader ? args.leader : leader?.id,
      handledById: args.wonBy ? args.wonBy : undefined,
      name: args.q
        ? {
            contains: args.q,
            mode: "insensitive",
          }
        : undefined,
      memberType: {
        in: memberTypeFilter,
      },
      soulWinningReports: args.soulWinningReportId
        ? { some: { id: args.soulWinningReportId } }
        : undefined,
    },
  });

  const newBelieversQuery = prisma.newBeliever.findMany({
    where: {
      networkLeaderId: args.leader ? args.leader : leader?.id,
      handledById: args.wonBy ? args.wonBy : undefined,
      name: args.q
        ? {
            contains: args.q,
            mode: "insensitive",
          }
        : undefined,
      memberType: {
        in: memberTypeFilter,
      },
      soulWinningReports: args.soulWinningReportId
        ? { some: { id: args.soulWinningReportId } }
        : undefined,
    },
    include: {
      networkLeader: {
        select: {
          id: true,
          name: true,
        },
      },
      handledBy: {
        select: { id: true, name: true },
      },
      soulWinningReports: {
        select: {
          lessonId: true,
        },
      },
    },

    take: pageSizeParam,
    skip: getSkip({ limit: pageSizeParam, page: args?.page }),
    orderBy: [
      ...getNewBelieversSort(args.sort, args.order),
      {
        id: "asc",
      },
    ],
  });

  // we use the Soul Winning & Consolidation Lessons as Main Headings of the table
  const lessonSeriesTitles = args.lessonView
    ? args.lessonView === "soul-winning"
      ? ["Soul-Winning", "Soul Winning"]
      : ["Consolidation"]
    : ["Soul-Winning", "Soul Winning", "Consolidation"];

  const soulwinningAndConsoLessonsQuery = prisma.lessonSeries.findMany({
    where: {
      title: { in: lessonSeriesTitles },
    },
    select: {
      lessons: {
        select: {
          id: true,
          title: true,
          lessonSeries: { select: { title: true } },
        },
      },
    },
  });

  const [totalFiltered, newBelievers, soulwinningAndConsoLessons] =
    await Promise.all([
      totalFilteredQuery,
      newBelieversQuery,
      soulwinningAndConsoLessonsQuery,
    ]);

  const lessons = soulwinningAndConsoLessons.flatMap((l) => l.lessons);

  const pageInfo = {
    total: totalFiltered,
    page: args.page ? Number(args.page) : 1,
    pageSize: pageSizeParam,
  };

  return {
    lessons,
    newBelievers,
    user,
    isAdmin: user.sessionClaims.metadata.role === "admin",
    pageInfo: {
      ...pageInfo,
      itemCount: newBelievers.length,
      totalPages: Math.ceil(totalFiltered / pageSizeParam),
    },
  };
}
