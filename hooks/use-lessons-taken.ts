"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import type { Lesson, LessonSeries } from "@/app/generated/prisma";
import type { CellReportRecord } from "@/features/cell-reports/queries";
import { API_ENDPOINTS, apiClient } from "@/lib/api-client";

type LessonsTakenResponse = {
  lessonsTaken: Array<Lesson & { lessonSeries: LessonSeries }>;
  attendedCellGroups: CellReportRecord[];
};

async function getLessonsTakenByDisciple(args: {
  discipleId: string;
}): Promise<LessonsTakenResponse> {
  try {
    const response = await apiClient.get<LessonsTakenResponse>(
      `${API_ENDPOINTS.GET_DISCIPLES}/${args.discipleId}/lessons-taken`,
    );

    return response.data;
  } catch (error) {
    console.error(`Error getting Lessons Taken by Disciples: `, error);
    return { lessonsTaken: [], attendedCellGroups: [] };
  }
}

export function useLessonsTaken() {
  const { discipleId } = useParams<{ discipleId: string }>();

  return useQuery({
    queryKey: ["lessons-taken", discipleId],
    queryFn: () => getLessonsTakenByDisciple({ discipleId }),
  });
}
