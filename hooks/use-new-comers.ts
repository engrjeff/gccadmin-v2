"use client";

import { useQuery } from "@tanstack/react-query";
import type { NewComer } from "@/app/generated/prisma";
import { API_ENDPOINTS, apiClient } from "@/lib/api-client";

interface EnhancedNewComer extends NewComer {
  invitedBy: { id: string; name: string; leader: { id: string; name: string } };
  attendances: { _count: number };
}

// new attendees
async function getNewComers(): Promise<EnhancedNewComer[]> {
  try {
    const response = await apiClient.get<EnhancedNewComer[]>(
      API_ENDPOINTS.GET_NEW_COMERS,
    );
    return response.data;
  } catch (error) {
    console.error(`Error getting New Comers: `, error);
    return [];
  }
}

export function useNewComers() {
  return useQuery({
    queryKey: ["new-comers"],
    queryFn: () => getNewComers(),
  });
}
