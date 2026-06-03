"use client";

import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS, apiClient } from "@/lib/api-client";

type ReturnData = {
  soulWinningSessions: number;
  consolidationSessions: number;
  newBelievers: number;
};

async function getSoulWinningStatisticsV2(): Promise<ReturnData> {
  try {
    const response = await apiClient.get<ReturnData>(
      API_ENDPOINTS.GET_SOUL_WINNING_STATISTICS_V2,
    );
    return response.data;
  } catch (error) {
    console.error(`Error getting Soul Winning Statistics V2: `, error);
    return {
      soulWinningSessions: 0,
      consolidationSessions: 0,
      newBelievers: 0,
    };
  }
}

export function useSoulWinningStatisticsV2() {
  return useQuery({
    queryKey: ["soul-winning-statistics-v2"],
    queryFn: getSoulWinningStatisticsV2,
  });
}
