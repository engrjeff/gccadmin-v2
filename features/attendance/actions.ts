"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { leaderActionClient } from "@/lib/safe-action";
import {
  addAttendeesSchema,
  attendanceCreateSchema,
  attendanceDeleteSchema,
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

export const deleteAttendance = leaderActionClient
  .metadata({ actionName: "deleteAttendance" })
  .inputSchema(attendanceDeleteSchema)
  .action(async ({ parsedInput }) => {
    await prisma.attendance.delete({
      where: { id: parsedInput.id },
    });

    revalidatePath("/attendance");

    return { success: true };
  });

export const addAttendees = leaderActionClient
  .metadata({ actionName: "addAttendees" })
  .inputSchema(addAttendeesSchema)
  .action(async ({ parsedInput }) => {
    const { attendanceId, attendees, newComers } = parsedInput;

    const attendance = await prisma.$transaction(async (tx) => {
      // delete first the new comers for this attendance
      await tx.newComer.deleteMany({ where: { attendanceId } });

      const result = await tx.attendance.update({
        where: { id: attendanceId },
        data: {
          attendees: {
            set: attendees.map((attendee) => ({ id: attendee.id })),
          },
          newComers: {
            createMany: {
              data: newComers.map((nc) => ({
                name: nc.name,
                gender: nc.gender,
                memberType: nc.memberType,
                invitedById: nc.invitedById,
                email: nc.email,
                contactNo: nc.contactNo,
                address: nc.address,
              })),
            },
          },
        },
      });

      return result;
    });

    return { attendance };
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
