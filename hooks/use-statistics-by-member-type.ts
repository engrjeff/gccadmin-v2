"use client";

import { useQuery } from "@tanstack/react-query";
import type { ChurchStatus, MemberType } from "@/app/generated/prisma";
import { API_ENDPOINTS, apiClient } from "@/lib/api-client";

type ReturnData = {
  total: number;
  data: Array<{
    churchStatus: ChurchStatus;
    _count: { churchStatus: number };
  }>;
};

type Args = {
  memberType: MemberType;
};

async function getStatisticsByMemberType(args: Args): Promise<ReturnData> {
  try {
    const response = await apiClient.get<ReturnData>(
      API_ENDPOINTS.GET_STATISTICS_BY_MEMBER_TYPE,
      {
        params: args,
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Error getting Statistics By MemberType: `, error);
    return {
      total: 0,
      data: [],
    };
  }
}

export function useStatisticsByMemberType(args: Args) {
  return useQuery({
    queryKey: ["statistics-by-member-type", args.memberType],
    queryFn: () => getStatisticsByMemberType(args),
  });
}
