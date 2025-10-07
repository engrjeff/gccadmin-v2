import z from "zod";
import { CellType } from "@/app/generated/prisma";

export const cellReportCreateSchema = z.object({
  type: z.enum(CellType, {
    error: "Invalid cell type",
  }),

  venue: z
    .string({ error: "Venue is required" })
    .min(1, { message: "Venue is required" }),

  date: z.iso.datetime({ local: true, error: "Date is required" }),

  lessonId: z.string().optional(),
  lessonTitle: z.string().optional(),
  scriptureReferences: z.string().array().optional(),

  assistantId: z.string().optional(),
  attendees: z
    .string()
    .array()
    .min(1, { message: "Must have at least 1 attendee" }),

  leaderId: z.string().optional(), // because the leader can be a form input

  worship: z.string().array().optional(),

  work: z.string().array().optional(),
});

export type CellReportCreateInputs = z.infer<typeof cellReportCreateSchema>;

export const cellReportEditSchema = cellReportCreateSchema
  .omit({
    leaderId: true,
    assistantId: true,
    attendees: true,
  })
  .extend({
    id: z.string({ error: "Cell Report ID is required." }),
  });

export type CellReportEditInputs = z.infer<typeof cellReportEditSchema>;
