"use client";

import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS, apiClient } from "@/lib/api-client";

interface CellReportTrendData {
  month: string;
  DISCIPLESHIP: number;
  SOULWINNING: number;
  OPEN: number;
}

interface ReturnData {
  data: CellReportTrendData[];
  year: number;
}

async function getCellReportTrend(year?: string): Promise<ReturnData | null> {
  try {
    const response = await apiClient.get<ReturnData>(
      API_ENDPOINTS.GET_CELLREPORT_TREND,
      {
        params: year ? { year } : undefined,
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Error getting cell report trend: `, error);
    return null;
  }
}

export function useCellReportTrend(year?: string) {
  return useQuery({
    queryKey: ["cell-report-trend", year],
    queryFn: () => getCellReportTrend(year),
  });
}
