"use client";

import { useQuery } from "@tanstack/react-query";
import type { Disciple } from "@/app/generated/prisma";
import { API_ENDPOINTS, apiClient } from "@/lib/api-client";

async function getAssistantLeaders(): Promise<Disciple[]> {
  try {
    const response = await apiClient.get<Disciple[]>(
      API_ENDPOINTS.GET_ASSISTANT_LEADERS,
    );
    return response.data;
  } catch (error) {
    console.error(`Error getting Assistant Leaders: `, error);
    return [];
  }
}

export function useAssistantLeaders() {
  return useQuery({
    queryKey: ["assistant-leaders"],
    queryFn: getAssistantLeaders,
  });
}
