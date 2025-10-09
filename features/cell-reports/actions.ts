"use server";

import { isToday } from "date-fns";
import { revalidatePath } from "next/cache";
import { CellStatus } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { leaderActionClient } from "@/lib/safe-action";
import { getNextCellStatus } from "@/lib/utils.server";
import { cellReportCreateSchema, cellReportEditSchema } from "./schema";

export const createCellReport = leaderActionClient
  .metadata({ actionName: "createCellReport" })
  .inputSchema(cellReportCreateSchema)
  .action(async ({ parsedInput, ctx: { leader } }) => {
    const {
      attendees,
      assistantId,
      leaderId: inputLeaderId,
      ...body
    } = parsedInput;

    const leaderId = leader === null ? (inputLeaderId as string) : leader.id;

    // get first the attendees
    const attendedDisciples = await prisma.disciple.findMany({
      where: { id: { in: attendees } },
      select: {
        id: true,
        cellStatus: true,
        churchStatus: true,
        createdAt: true,
      },
    });

    const result = await prisma.$transaction(
      async (tx) => {
        const cellReport = await tx.cellReport.create({
          data: {
            ...body,
            leaderId,
            date: new Date(parsedInput.date),
            hasCustomLesson: Boolean(body.lessonTitle),
            attendees: {
              connect: attendees.map((a) => ({ id: a })),
            },
          },
        });

        // update the cell status
        await Promise.all(
          attendedDisciples.map(async (attendee) => {
            const cellStatus =
              isToday(attendee.createdAt) &&
              attendee.cellStatus === CellStatus.FIRST_TIMER
                ? attendee.cellStatus
                : getNextCellStatus(attendee.cellStatus);

            const disciple = await tx.disciple.update({
              where: { id: attendee.id },
              data: {
                cellStatus,
                ...(assistantId === attendee.id && {
                  assistedCellGroups: {
                    connect: {
                      id: cellReport.id,
                    },
                  },
                }),
              },
            });

            // create cell report attendee snapshot
            await tx.cellReportAttendeeSnapshot.create({
              data: {
                discipleId: disciple.id,
                name: disciple.name,
                status: cellStatus,
                churchStatus: disciple.churchStatus,
                cellReportId: cellReport.id,
              },
            });

            return disciple;
          }),
        );
        return cellReport;
      },
      {
        timeout: 10000,
      },
    );

    revalidatePath("/cell-reports");

    return {
      cellReport: result,
    };
  });

export const editCellReport = leaderActionClient
  .metadata({ actionName: "editCellReport" })
  .inputSchema(cellReportEditSchema)
  .action(async ({ parsedInput, ctx: { leader } }) => {
    const {
      attendees,
      assistantId,
      leaderId: inputLeaderId,
      id,
      ...body
    } = parsedInput;

    // find the cell report first
    const origReport = await prisma.cellReport.findUnique({
      where: { id },
      include: { cellReportAttendeeSnapshots: true },
    });

    if (!origReport) return { cellReport: null };

    // get the createdAt
    const createdAt = origReport.createdAt;
    // get the snapshots and create a disciple-cellStatus map
    const origAttendeesSnapShotMap = new Map(
      origReport.cellReportAttendeeSnapshots.map((cs) => [
        cs.discipleId,
        cs.status,
      ]),
    );

    // delete the orig report
    await prisma.cellReport.delete({ where: { id } });

    const leaderId = leader === null ? (inputLeaderId as string) : leader.id;

    // get first the attendees
    const attendedDisciples = await prisma.disciple.findMany({
      where: { id: { in: attendees } },
      select: {
        id: true,
        cellStatus: true,
        churchStatus: true,
        createdAt: true,
      },
    });

    const result = await prisma.$transaction(
      async (tx) => {
        const cellReport = await tx.cellReport.create({
          data: {
            ...body,
            leaderId,
            date: new Date(parsedInput.date),
            hasCustomLesson: Boolean(body.lessonTitle),
            createdAt,
            attendees: {
              connect: attendees.map((a) => ({ id: a })),
            },
          },
        });

        // update the cell status
        await Promise.all(
          attendedDisciples.map(async (attendee) => {
            let cellStatus = origAttendeesSnapShotMap.get(attendee.id);

            if (!cellStatus) {
              cellStatus =
                isToday(attendee.createdAt) &&
                attendee.cellStatus === CellStatus.FIRST_TIMER
                  ? attendee.cellStatus
                  : getNextCellStatus(attendee.cellStatus);
            }

            const disciple = await tx.disciple.update({
              where: { id: attendee.id },
              data: {
                cellStatus,
                ...(assistantId === attendee.id && {
                  assistedCellGroups: {
                    connect: {
                      id: cellReport.id,
                    },
                  },
                }),
              },
            });

            // create cell report attendee snapshot
            await tx.cellReportAttendeeSnapshot.create({
              data: {
                discipleId: disciple.id,
                name: disciple.name,
                status: cellStatus,
                churchStatus: disciple.churchStatus,
                cellReportId: cellReport.id,
              },
            });

            return disciple;
          }),
        );
        return cellReport;
      },
      {
        timeout: 10000,
      },
    );

    revalidatePath("/cell-reports");

    return {
      cellReport: result,
    };
  });
