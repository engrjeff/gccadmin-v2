"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { API_ENDPOINTS, apiClient } from "@/lib/api-client";
import type { CellReportRecord } from "@/types/globals";

interface ReturnData {
  cellReports: CellReportRecord[];
  dateRangeFilter: { start: string; end: string };
}

async function getCellGroupStatistics(args: {
  dateRange: DateRange;
}): Promise<ReturnData | null> {
  try {
    // const period =
    //   getClientDateRange(args.dateRange) ?? getClientDateRange("this_week");

    const response = await apiClient.get<ReturnData>(
      API_ENDPOINTS.GET_CELLGROUP_STATISTICS,
      {
        params: {
          dateRangeStart: format(args.dateRange?.from as Date, "yyyy-MM-dd"),
          dateRangeEnd: `${format(args.dateRange.to as Date, "yyyy-MM-dd")}`,
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
