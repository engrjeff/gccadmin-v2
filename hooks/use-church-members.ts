"use client";

import { useQuery } from "@tanstack/react-query";
import type { Disciple, Gender, MemberType } from "@/app/generated/prisma";
import { API_ENDPOINTS, apiClient } from "@/lib/api-client";

type ReturnData = {
  leaders: { label: string; members: Disciple[] };
  churchMembers: Array<{ label: string; members: Disciple[] }>;
};

type GetChurchMembersArgs = {
  gender: Gender | "all";
  memberType?: MemberType;
  q?: string;
};

async function getChurchMembers(
  args: GetChurchMembersArgs,
): Promise<ReturnData> {
  try {
    const response = await apiClient.get<ReturnData>(
      API_ENDPOINTS.GET_CHURCH_MEMBERS,
      {
        params: args,
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Error getting Church Members: `, error);
    return {
      leaders: { label: "Primary Leaders", members: [] },
      churchMembers: [],
    };
  }
}

export function useChurchMembers(args: GetChurchMembersArgs) {
  return useQuery({
    queryKey: ["church-members", args.gender, args.memberType, args.q],
    queryFn: () => getChurchMembers(args),
  });
}
