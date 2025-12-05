import * as z from "zod";
import { Gender, MemberType } from "@/app/generated/prisma";

// the newly-won souls
// attendees of Soul-Winning Reports
export const newBelieverSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  gender: z.enum(Gender, { error: "Invalid gender" }),
  memberType: z.enum(MemberType, { error: "Invalid member type" }),
  contactNo: z.string().optional(),
  email: z.union([z.literal(""), z.email()]).optional(),
  address: z.string().optional(),
  handledById: z.string().optional(),
});

export type NewBelieverInputs = z.infer<typeof newBelieverSchema>;

export const soulWinningReportCreateSchema = z.object({
  venue: z
    .string({ error: "Venue is required" })
    .min(1, { message: "Venue is required" }),

  date: z.iso.datetime({ local: true, error: "Date is required" }),

  lessonId: z
    .string({ error: "Lesson is required." })
    .nonempty({ error: "Lesson is required." }),

  newBelievers: newBelieverSchema
    .array()
    .min(1, { message: "Must have at least 1 new believer" }),

  networkLeaderId: z.string().optional(), // because the leader can be a form input

  assistantLeaderId: z.string().optional(),
});

export type SoulWinningCreateInputs = z.infer<
  typeof soulWinningReportCreateSchema
>;

export const consolidationReportCreateSchema = z.object({
  venue: z
    .string({ error: "Venue is required" })
    .min(1, { message: "Venue is required" }),

  date: z.iso.datetime({ local: true, error: "Date is required" }),

  lessonId: z
    .string({ error: "Lesson is required." })
    .nonempty({ error: "Lesson is required." }),

  newBelievers: z
    .string()
    .array()
    .min(1, { message: "Must have at least 1 new believer" }),

  networkLeaderId: z.string().optional(), // because the leader can be a form input

  assistantLeaderId: z.string().optional(),
});

export type ConsolidationCreateInputs = z.infer<
  typeof consolidationReportCreateSchema
>;

export const reportIdSchema = z.object({
  id: z.string({ error: "Report ID is required." }),
});
