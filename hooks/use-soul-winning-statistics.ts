"use client";

import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS, apiClient } from "@/lib/api-client";

type ReturnData = {
  wonSouls: number;
  consolidatedSouls: number;
  attendedChurchSouls: number;
};

async function getSoulWinningStatistics(): Promise<ReturnData> {
  try {
    const response = await apiClient.get<ReturnData>(
      API_ENDPOINTS.GET_SOUL_WINNING_STATISTICS,
    );
    return response.data;
  } catch (error) {
    console.error(`Error getting Soul Winning Statistics: `, error);
    return {
      wonSouls: 0,
      consolidatedSouls: 0,
      attendedChurchSouls: 0,
    };
  }
}

export function useSoulWinningStatistics() {
  return useQuery({
    queryKey: ["soul-winning-statistics"],
    queryFn: getSoulWinningStatistics,
  });
}
