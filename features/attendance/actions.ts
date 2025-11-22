"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { leaderActionClient } from "@/lib/safe-action";
import {
  addAttendeesSchema,
  attendanceCreateSchema,
  attendanceEditSchema,
  removeAttendeesSchema,
} from "./schema";

export const createAttendance = leaderActionClient
  .metadata({ actionName: "createAttendance" })
  .inputSchema(attendanceCreateSchema)
  .action(async ({ parsedInput }) => {
    const attendance = await prisma.attendance.create({
      data: {
        ...parsedInput,
        date: new Date(parsedInput.date),
      },
    });

    revalidatePath("/attendance");

    return { attendance };
  });

export const editAttendance = leaderActionClient
  .metadata({ actionName: "editAttendance" })
  .inputSchema(attendanceEditSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;

    const attendance = await prisma.attendance.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
    });

    revalidatePath("/attendance");
    revalidatePath(`/attendance/${id}`);

    return { attendance };
  });

export const addAttendees = leaderActionClient
  .metadata({ actionName: "addAttendees" })
  .inputSchema(addAttendeesSchema)
  .action(async ({ parsedInput }) => {
    const { attendanceId, attendees } = parsedInput;

    const attendance = await prisma.attendance.update({
      where: { id: attendanceId },
      data: {
        attendees: {
          connect: attendees.map((attendee) => ({ id: attendee.id })),
        },
      },
    });

    revalidatePath("/attendance");
    revalidatePath(`/attendance/${attendanceId}`);

    return attendance;
  });

export const removeAttendees = leaderActionClient
  .metadata({ actionName: "removeAttendees" })
  .inputSchema(removeAttendeesSchema)
  .action(async ({ parsedInput }) => {
    const { attendanceId, attendeeIds } = parsedInput;

    const attendance = await prisma.attendance.update({
      where: { id: attendanceId },
      data: {
        attendees: {
          disconnect: attendeeIds.map((attendeeId) => ({ id: attendeeId })),
        },
      },
    });

    revalidatePath("/attendance");
    revalidatePath(`/attendance/${attendanceId}`);

    return attendance;
  });
