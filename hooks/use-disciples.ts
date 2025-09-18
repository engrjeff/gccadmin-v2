"use client";

import { useQuery } from "@tanstack/react-query";
import type { Disciple } from "@/app/generated/prisma";
import { API_ENDPOINTS, apiClient } from "@/lib/api-client";

async function getDisciples(args: { leaderId?: string }): Promise<Disciple[]> {
  try {
    const response = await apiClient.get<Disciple[]>(
      API_ENDPOINTS.GET_DISCIPLES,
      { params: args },
    );
    return response.data;
  } catch (error) {
    console.error(`Error getting Disciples: `, error);
    return [];
  }
}

export function useDisciples({ leaderId }: { leaderId?: string }) {
  return useQuery({
    queryKey: ["disciples", leaderId],
    queryFn: () => getDisciples({ leaderId }),
  });
}
