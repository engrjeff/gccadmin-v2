"use client";

import { useQuery } from "@tanstack/react-query";
import type { MemberType, NewComer } from "@/app/generated/prisma";
import { API_ENDPOINTS, apiClient } from "@/lib/api-client";

type ReturnData = {
  label: string;
  members: NewComer[];
};

type GetReturneesArgs = {
  memberType?: MemberType;
  q?: string;
  currentAttendanceId: string;
};

async function getReturnees(args: GetReturneesArgs): Promise<ReturnData> {
  try {
    const response = await apiClient.get<ReturnData>(
      API_ENDPOINTS.GET_RETURNEES,
      {
        params: args,
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Error getting Returnees: `, error);
    return {
      label: "Returnees",
      members: [],
    };
  }
}

export function useReturnees(args: GetReturneesArgs) {
  return useQuery({
    queryKey: ["returnees", args.memberType, args.q, args.currentAttendanceId],
    queryFn: () => getReturnees(args),
  });
}
