"use client";

import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS, apiClient } from "@/lib/api-client";

type RequestType = "memberType" | "cellStatus" | "churchStatus";

type Key = "memberType" | "cellStatus" | "churchStatus";

type Result<K extends Key, T> = {
  _count: {
    [key in K]: number;
  };
} & {
  [key in K]: T;
};

async function getMemberStatistics<K extends Key, T>(type: RequestType) {
  try {
    const result = await apiClient.get<Result<K, T>[] | null>(
      API_ENDPOINTS.GET_MEMBER_STATISTICS,
      {
        params: { type },
      },
    );

    return result.data;
  } catch (error) {
    console.error(`Error getting Member statistics: `, error);
    return null;
  }
}

export function useMemberStatistics<K extends Key, T>(type: RequestType) {
  return useQuery({
    queryKey: ["member-statistics", type],
    queryFn: () => getMemberStatistics<K, T>(type),
  });
}
