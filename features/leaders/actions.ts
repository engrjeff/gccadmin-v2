"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Role } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action";
import { assignAccountSchema } from "./schema";

export const assignAccountToLeader = authActionClient
  .metadata({ actionName: "assignAccountToLeader" })
  .inputSchema(assignAccountSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    if (!user?.userId) throw new Error("Session not found.");

    const { leaderId, userAccountId, userAccountEmail } = parsedInput;

    const result = await prisma.$transaction(async (tx) => {
      // find the leader
      const leader = await tx.disciple.findUnique({ where: { id: leaderId } });

      if (!leader) return { success: false, error: "Leader not found." };

      // create User record w/ Role = USER
      const user = await tx.user.create({
        data: {
          clerkId: userAccountId,
          name: leader.name,
          email: userAccountEmail,
          role: Role.USER,
          discipleProfile: {
            connect: {
              id: leader.id,
            },
          },
        },
      });

      // assign Role = LEADER to clerk user account
      const client = await clerkClient();

      await client.users.updateUserMetadata(userAccountId, {
        publicMetadata: { role: "leader" },
      });

      return { success: true, data: user };
    });

    revalidatePath(`/leaders/${leaderId}`);

    return {
      result,
    };
  });
