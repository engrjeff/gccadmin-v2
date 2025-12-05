"use server";

import { revalidatePath } from "next/cache";
import { SoulWinningReportType } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { leaderActionClient } from "@/lib/safe-action";
import {
  consolidationReportCreateSchema,
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
