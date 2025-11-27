"use client";

import { useQuery } from "@tanstack/react-query";
import type { Attendance, Disciple, NewComer } from "@/app/generated/prisma";
import { API_ENDPOINTS, apiClient } from "@/lib/api-client";

type ReturnData = {
  attendance:
    | null
    | (Attendance & { attendees: Disciple[]; newComers: NewComer[] });
};

async function getAttendanceRecord(id: string): Promise<ReturnData> {
  try {
    const response = await apiClient.get<ReturnData>(
      `${API_ENDPOINTS.GET_ATTENDANCE}/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error getting Attendance Record: `, error);
    return { attendance: null };
  }
}

export function useAttendanceRecord(id: string) {
  return useQuery({
    queryKey: ["attendance-record", id],
    queryFn: () => getAttendanceRecord(id),
  });
}
