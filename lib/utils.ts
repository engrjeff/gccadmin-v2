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
