import type { Option } from "@/types/globals";
import { removeUnderscores } from "./utils";

export const processLevels: Option[] = [
  "NONE",
  "PREENC",
  "ENCOUNTER",
  "LEADERSHIP_1",
  "LEADERSHIP_2",
  "LEADERSHIP_3",
].map((p) => ({ value: p, label: removeUnderscores(p) }));

export const memberTypes: Option[] = [
  "KIDS",
  "YOUTH",
  "YOUNGPRO",
  "MEN",
  "WOMEN",
  "UNCATEGORIZED",
].map((m) => ({
  value: m,
  label: removeUnderscores(m),
}));

export const cellStatuses: Option[] = [
  "FIRST_TIMER",
  "SECOND_TIMER",
  "THIRD_TIMER",
  "REGULAR",
].map((m) => ({
  value: m,
  label: removeUnderscores(m),
}));

export const churchStatuses: Option[] = ["NACS", "ACS", "REGULAR"].map((m) => ({
  value: m,
  label: removeUnderscores(m),
}));
