"use client";

import { useQuery } from "@tanstack/react-query";
import type { NewBeliever } from "@/app/generated/prisma";
import { API_ENDPOINTS, apiClient } from "@/lib/api-client";

async function getNewBelievers(args: {
  leaderId?: string;
}): Promise<NewBeliever[]> {
  try {
    const response = await apiClient.get<NewBeliever[]>(
      API_ENDPOINTS.GET_NEW_BELIEVERS,
      { params: args },
    );
    return response.data;
  } catch (error) {
    console.error(`Error getting New Believers: `, error);
    return [];
  }
}

export function useNewBelievers({ leaderId }: { leaderId?: string }) {
  return useQuery({
    queryKey: ["new-believers", leaderId],
    queryFn: () => getNewBelievers({ leaderId }),
  });
}
