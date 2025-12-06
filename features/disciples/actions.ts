"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { authActionClient, leaderActionClient } from "@/lib/safe-action";
import {
  discipleCreateSchema,
  discipleIdSchema,
  discipleProfileSchema,
  discipleStatusChangeSchema,
  discipleUpdateSchema,
  importDisciplesSchema,
  promoteAsDiscipleSchema,
} from "./schema";

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
        isMyPrimary: parsedInput.isMyPrimary,
        handledById: parsedInput.handledById,
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

export const deleteDisciple = authActionClient
  .metadata({ actionName: "deleteDisciple" })
  .inputSchema(discipleIdSchema)
  .action(async ({ parsedInput }) => {
    // soft delete
    await prisma.disciple.update({
      where: { id: parsedInput.id },
      data: {
        isDeleted: true,
      },
    });

    revalidatePath("/disciples");

    return {
      success: true,
    };
  });

export const updateDiscipleStatus = authActionClient
  .metadata({ actionName: "updateDiscipleStatus" })
  .inputSchema(discipleStatusChangeSchema)
  .action(async ({ parsedInput }) => {
    await prisma.disciple.update({
      where: { id: parsedInput.id },
      data: {
        isActive: parsedInput.isActive,
      },
    });

    revalidatePath("/disciples");

    return {
      success: true,
    };
  });

export const updateDisciple = authActionClient
  .metadata({ actionName: "updateDisciple" })
  .inputSchema(discipleUpdateSchema)
  .action(async ({ parsedInput: { id, ...data } }) => {
    const disciple = await prisma.disciple.update({
      where: {
        id,
      },
      data: {
        ...data,
        birthdate: data.birthdate ? new Date(data.birthdate) : undefined,
      },
    });

    revalidatePath("/disciples");

    return {
      disciple,
    };
  });

export const updateDiscipleProfile = authActionClient
  .metadata({ actionName: "updateDiscipleProfile" })
  .inputSchema(discipleProfileSchema)
  .action(async ({ parsedInput }) => {
    const { id, name, address, birthdate } = parsedInput;

    const disciple = await prisma.disciple.update({
      where: {
        id,
      },
      data: {
        name,
        address,
        birthdate: birthdate ? new Date(birthdate) : undefined,
      },
    });

    revalidatePath("/profile");

    return {
      disciple,
    };
  });

export const promoteAsDisciple = leaderActionClient
  .metadata({ actionName: "promoteAsDisciple" })
  .inputSchema(promoteAsDiscipleSchema)
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
        isMyPrimary: parsedInput.isMyPrimary,
        handledById: parsedInput.handledById,
        leaderId,
        asNewSoulProfile: parsedInput.newBelieverId
          ? {
              connect: { id: parsedInput.newBelieverId },
            }
          : undefined,
        asNewComerProfile: parsedInput.newComerId
          ? {
              connect: { id: parsedInput.newComerId },
            }
          : undefined,
      },
    });

    revalidatePath("/disciples");

    return {
      disciple,
    };
  });
