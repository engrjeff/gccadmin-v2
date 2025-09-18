"use client";

import { useQuery } from "@tanstack/react-query";
import type { CellReport } from "@/app/generated/prisma";
import { API_ENDPOINTS, apiClient } from "@/lib/api-client";
import type { DateRange } from "@/types/globals";

interface ReturnData {
  cellReports: CellReport[];
  dateRangeFilter: { start: string; end: string };
}

async function getCellGroupStatistics(args: {
  dateRange: DateRange;
}): Promise<ReturnData | null> {
  try {
    const response = await apiClient.get<ReturnData>(
      API_ENDPOINTS.GET_CELLGROUP_STATISTICS,
      { params: args },
    );
    return response.data;
  } catch (error) {
    console.error(`Error getting Cell Group statistics: `, error);
    return null;
  }
}

export function useCellGroupStatistics(args: { dateRange: DateRange }) {
  return useQuery({
    queryKey: ["cell-group-statistics", args.dateRange],
    queryFn: () => getCellGroupStatistics(args),
  });
}
