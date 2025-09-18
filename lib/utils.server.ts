import { auth } from "@clerk/nextjs/server";
import {
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from "date-fns";
import type { CellStatus } from "@/app/generated/prisma";
import type { CellReportsQueryArgs } from "@/features/cell-reports/queries";
import type { UserAccountRole } from "@/types/globals";

export const checkRole = async (role: UserAccountRole) => {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata.role === role;
};

export function getSkip({ limit, page }: { limit?: number; page?: number }) {
  const _limit = limit ?? 12;
  const _page = page ?? 1;

  return _limit * (_page - 1);
}

export const getNextCellStatus = (cellStatus: CellStatus): CellStatus => {
  switch (cellStatus) {
    case "FIRST_TIMER":
      return "SECOND_TIMER";
    case "SECOND_TIMER":
      return "THIRD_TIMER";
    case "THIRD_TIMER":
      return "REGULAR";
    default:
      return "REGULAR";
  }
};

export function getDateRange(
  preset: CellReportsQueryArgs["dateRange"],
): { start: Date; end: Date } | undefined {
  if (!preset) return undefined;

  const now = new Date();

  if (preset === "this_week") {
    return {
      start: startOfWeek(now, { weekStartsOn: 1 }),
      end: endOfWeek(now, { weekStartsOn: 1 }),
    };
  }

  if (preset === "last_week") {
    return {
      start: subDays(startOfWeek(now, { weekStartsOn: 1 }), 7),
      end: subDays(endOfWeek(now, { weekStartsOn: 1 }), 7),
    };
  }

  if (preset === "this_month") {
    return {
      start: startOfMonth(now),
      end: endOfMonth(now),
    };
  }

  if (preset === "last_month") {
    return {
      start: startOfMonth(subMonths(now, 1)),
      end: endOfMonth(subMonths(now, 1)),
    };
  }
}
