import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
