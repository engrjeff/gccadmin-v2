"use client";

import { useQuery } from "@tanstack/react-query";
import type { Lesson, LessonSeries } from "@/app/generated/prisma";
import { API_ENDPOINTS, apiClient } from "@/lib/api-client";

export interface SeriesWithLessons extends LessonSeries {
  lessons: Lesson[];
}

async function getLessonSeries(): Promise<SeriesWithLessons[]> {
  try {
    const response = await apiClient.get<SeriesWithLessons[]>(
      API_ENDPOINTS.GET_LESSON_SERIES,
    );
    return response.data;
  } catch (error) {
    console.error(`Error getting Lesson Series: `, error);
    return [];
  }
}

export function useLessonSeries() {
  return useQuery({
    queryKey: ["lesson-series"],
    queryFn: getLessonSeries,
  });
}
