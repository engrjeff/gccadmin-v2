"use client";

import { useQuery } from "@tanstack/react-query";
import type { Disciple } from "@/app/generated/prisma";
import { API_ENDPOINTS, apiClient } from "@/lib/api-client";

async function getLeaders(): Promise<Disciple[]> {
  try {
    const response = await apiClient.get<Disciple[]>(API_ENDPOINTS.GET_LEADERS);
    return response.data;
  } catch (error) {
    console.error(`Error getting Leaders: `, error);
    return [];
  }
}

export function useLeaders({ enabled = false }: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["leaders", enabled],
    queryFn: getLeaders,
    enabled,
  });
}
