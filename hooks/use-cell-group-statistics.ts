"use client";

import { useQuery } from "@tanstack/react-query";
import type { CellReportRecord } from "@/features/cell-reports/queries";
import { API_ENDPOINTS, apiClient } from "@/lib/api-client";
import { getClientDateRange } from "@/lib/utils";
import type { DateRange } from "@/types/globals";

interface ReturnData {
  cellReports: CellReportRecord[];
  dateRangeFilter: { start: string; end: string };
}

async function getCellGroupStatistics(args: {
  dateRange: DateRange;
}): Promise<ReturnData | null> {
  try {
    const period =
      getClientDateRange(args.dateRange) ?? getClientDateRange("this_week");

    const response = await apiClient.get<ReturnData>(
      API_ENDPOINTS.GET_CELLGROUP_STATISTICS,
      {
        params: {
          dateRangeStart: period?.start.toISOString(),
          dateRangeEnd: period?.end.toISOString(),
        },
      },
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
