import { auth } from "@clerk/nextjs/server";
import {
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";
import type { CellStatus } from "@/app/generated/prisma";
import type { DateRange, UserAccountRole } from "@/types/globals";

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
  preset: DateRange,
): { start: Date; end: Date } | undefined {
  if (!preset) return undefined;

  // const now = new Date().toLocaleDateString("en-PH");
  const timeZone = "Asia/Manila";
  const dateToday = new Date();
  const now = toZonedTime(dateToday, timeZone);

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

  if (preset === "last_last_month") {
    return {
      start: startOfMonth(subMonths(now, 2)),
      end: endOfMonth(subMonths(now, 2)),
    };
  }

  if (preset === "year_to_date") {
    return {
      start: startOfYear(now),
      end: now,
    };
  }
}
