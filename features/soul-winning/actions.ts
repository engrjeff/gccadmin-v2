"use server";

import { revalidatePath } from "next/cache";
import { SoulWinningReportType } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { leaderActionClient } from "@/lib/safe-action";
import {
  consolidationReportCreateSchema,
  reportIdSchema,
  soulWinningReportCreateSchema,
} from "./schema";

export const createSoulWinningReport = leaderActionClient
  .metadata({ actionName: "createSoulWinningReport" })
  .inputSchema(soulWinningReportCreateSchema)
  .action(async ({ parsedInput, ctx: { leader } }) => {
    const {
      assistantLeaderId,
      networkLeaderId: inputLeaderId,
      ...body
    } = parsedInput;

    const leaderId = leader === null ? (inputLeaderId as string) : leader.id;

    const result = await prisma.$transaction(async (tx) => {
      // create the new believers
      const newBelievers = await tx.newBeliever.createManyAndReturn({
        data: parsedInput.newBelievers.map((nb) => ({
          ...nb,
          networkLeaderId: leaderId,
          handledById: assistantLeaderId === "" ? undefined : assistantLeaderId,
        })),
      });

      // create the report
      const report = await tx.soulWinningReport.create({
        data: {
          ...body,
          networkLeaderId: leaderId,
          type: SoulWinningReportType.SOUL_WINNING,
          assistantLeaderId:
            assistantLeaderId === "" ? undefined : assistantLeaderId,
          date: new Date(parsedInput.date),
          newBelievers: {
            connect: newBelievers.map((nb) => ({ id: nb.id })),
          },
        },
      });

      return report;
    });

    revalidatePath("/soul-winning");

    return {
      report: result,
    };
  });

export const createConsolidationReport = leaderActionClient
  .metadata({ actionName: "createConsolidationReport" })
  .inputSchema(consolidationReportCreateSchema)
  .action(async ({ parsedInput, ctx: { leader } }) => {
    const {
      assistantLeaderId,
      networkLeaderId: inputLeaderId,
      newBelievers,
      ...body
    } = parsedInput;

    const leaderId = leader === null ? (inputLeaderId as string) : leader.id;

    const result = await prisma.$transaction(async (tx) => {
      // create the report
      const report = await tx.soulWinningReport.create({
        data: {
          ...body,
          networkLeaderId: leaderId,
          type: SoulWinningReportType.CONSOLIDATION,
          assistantLeaderId:
            assistantLeaderId === "" ? undefined : assistantLeaderId,
          date: new Date(parsedInput.date),
          newBelievers: {
            connect: newBelievers.map((id) => ({ id })),
          },
        },
      });

      // await Promise.all(
      //   newBelievers.map(async (newBelieverId) => {
      //     return tx.newBeliever.update({
      //       where: { id: newBelieverId },
      //       data: {
      //         soulWinningReports: {
      //           connect: {
      //             id: report.id,
      //           },
      //         },
      //       },
      //     });
      //   }),
      // );

      return report;
    });

    revalidatePath("/soul-winning");

    return {
      report: result,
    };
  });

export const deleteSoulWinningOrConsoReport = leaderActionClient
  .metadata({ actionName: "deleteSoulWinningReport" })
  .inputSchema(reportIdSchema)
  .action(async ({ parsedInput: { id } }) => {
    await prisma.$transaction(async (tx) => {
      const ok = await tx.soulWinningReport.delete({ where: { id } });

      if (ok.id) {
        // find the new believers having this report
        // if this report is the only report they have, then delete them as well
        const newBelieversInThisReport = await tx.newBeliever.findMany({
          where: {
            soulWinningReports: {
              every: {
                id,
              },
            },
          },
        });

        if (newBelieversInThisReport.length > 0) {
          await tx.newBeliever.deleteMany({
            where: { id: { in: newBelieversInThisReport.map((nb) => nb.id) } },
          });
        }
      }
    });

    revalidatePath("/soul-winning");
    revalidatePath("/soul-winning/consolidation");

    return { success: true };
  });
