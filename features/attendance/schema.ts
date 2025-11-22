import z from "zod";
import { AttendanceType, Gender, MemberType } from "@/app/generated/prisma";

export const attendanceCreateSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(1, { message: "Title is required" }),
  type: z.enum(AttendanceType, {
    error: "Invalid attendance type",
  }),
  date: z
    .string({ message: "Date is required" })
    .regex(/\d{4}-\d{2}-\d{2}/, { message: "Invalid date" }),
  tags: z.string().array().optional(),
});

export type AttendanceCreateInputs = z.infer<typeof attendanceCreateSchema>;

export const attendanceEditSchema = attendanceCreateSchema.extend({
  id: z.string({ error: "Attendance ID is required." }),
});

export type AttendanceEditInputs = z.infer<typeof attendanceEditSchema>;

export const newComerSchema = z.object({
  name: z.string({ error: "Required" }).nonempty({ error: "Required" }),
  gender: z.enum(Gender, { error: "Required" }),
  memberType: z.enum(MemberType, { error: "Required" }),
  contactNo: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  invitedById: z.string().optional(),
});

export const addAttendeesSchema = z.object({
  attendanceId: z.string({ error: "Attendance ID is required." }),
  attendees: z
    .object({
      id: z.string(),
    })
    .array()
    .min(1, { message: "Must have at least 1 attendee to add" }),
  newComers: newComerSchema.array(),
});

export type AddAttendeesInputs = z.infer<typeof addAttendeesSchema>;

export const removeAttendeesSchema = z.object({
  attendanceId: z.string({ error: "Attendance ID is required." }),
  attendeeIds: z
    .string()
    .array()
    .min(1, { message: "Must have at least 1 attendee to remove" }),
});

export type RemoveAttendeesInputs = z.infer<typeof removeAttendeesSchema>;
