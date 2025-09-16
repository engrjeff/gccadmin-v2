"use client";

import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS, apiClient } from "@/lib/api-client";

type ClerkUser = {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
};

async function getClerkUserAccounts(): Promise<ClerkUser[]> {
  try {
    const response = await apiClient.get<ClerkUser[]>(
      API_ENDPOINTS.GET_CLERK_USERS,
    );
    return response.data;
  } catch (error) {
    console.error(`Error getting Clerk User Accounts: `, error);
    return [];
  }
}

export function useClerkUserAccounts() {
  return useQuery({
    queryKey: ["clerk-user-accounts"],
    queryFn: getClerkUserAccounts,
  });
}
