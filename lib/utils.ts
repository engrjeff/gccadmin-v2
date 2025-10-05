import { type ClassValue, clsx } from "clsx";
import {
  endOfMonth,
  endOfWeek,
  format,
  intlFormatDistance,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { twMerge } from "tailwind-merge";
import type { DateRange } from "@/types/globals";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function removeUnderscores(inputStr: string) {
  if (inputStr && ["NACS", "ACS"].includes(inputStr)) return inputStr;

  if (!inputStr?.includes("_")) {
    return inputStr?.toLowerCase();
  }

  return inputStr.replaceAll("_", " ").toLowerCase();
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatCellGroupDate = (date: Date) => {
  return format(date.toISOString(), "PPp");
};

export const formatTime = (timeStr: string) => {
  const parts = timeStr.split(":");
  let hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes.toString().padStart(2, "0");
  const strTime = `${hours}:${minutesStr} ${ampm}`;
  return strTime;
};

export function formatDateDistance(dateInput: number | string | Date) {
  // return format(new Date(dateInput), "MMM dd, yyyy")
  return intlFormatDistance(new Date(dateInput), new Date(), {
    style: "narrow",
  });
}

export function getClientDateRange(
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
