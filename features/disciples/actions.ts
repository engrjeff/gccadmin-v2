"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { leaderActionClient } from "@/lib/safe-action";
import { importDisciplesSchema } from "./schema";

export const bulkCreateDisciples = leaderActionClient
  .metadata({ actionName: "bulkCreateDisciples" })
  .inputSchema(importDisciplesSchema)
  .action(async ({ parsedInput, ctx: { leader } }) => {
    const disciples = await prisma.disciple.createMany({
      data: parsedInput.disciples.map((disciple) => ({
        ...disciple,
        birthdate: new Date(disciple.birthdate),
        leaderId: leader.id,
      })),
    });

    revalidatePath("/disciples");

    return {
      disciples,
    };
  });
