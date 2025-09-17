"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { leaderActionClient } from "@/lib/safe-action";
import { discipleCreateSchema, importDisciplesSchema } from "./schema";

export const createDisciple = leaderActionClient
  .metadata({ actionName: "createDisciple" })
  .inputSchema(discipleCreateSchema)
  .action(async ({ parsedInput, ctx: { leader } }) => {
    const leaderId = leader === null ? parsedInput.leaderId : leader.id;

    const disciple = await prisma.disciple.create({
      data: {
        name: parsedInput.name,
        address: parsedInput.address,
        birthdate: new Date(parsedInput.birthdate),
        gender: parsedInput.gender,
        cellStatus: parsedInput.cellStatus,
        churchStatus: parsedInput.churchStatus,
        memberType: parsedInput.memberType,
        processLevel: parsedInput.processLevel,
        processLevelStatus: parsedInput.processLevelStatus,
        leaderId,
      },
    });

    revalidatePath("/disciples");

    return {
      disciple,
    };
  });

export const bulkCreateDisciples = leaderActionClient
  .metadata({ actionName: "bulkCreateDisciples" })
  .inputSchema(importDisciplesSchema)
  .action(async ({ parsedInput, ctx: { leader } }) => {
    const disciples = await prisma.disciple.createMany({
      data: parsedInput.disciples.map((disciple) => ({
        ...disciple,
        birthdate: new Date(disciple.birthdate),
        leaderId: leader ? leader.id : disciple.leaderId,
      })),
    });

    revalidatePath("/disciples");

    return {
      disciples,
    };
  });
