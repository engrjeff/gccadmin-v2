"use server";

import prisma from "@/lib/prisma";

export type LessonSeriesQueryArgs = {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: "asc" | "desc";
  q?: string;
};

export async function getLessonSeries(args: LessonSeriesQueryArgs) {
  const lessonSeriesList = await prisma.lessonSeries.findMany({
    where: {
      title: args.q
        ? {
            contains: args.q,
            mode: "insensitive",
          }
        : undefined,
    },
    include: {
      lessons: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: [{ createdAt: "desc" }, { title: "asc" }],
  });

  return lessonSeriesList;
}
