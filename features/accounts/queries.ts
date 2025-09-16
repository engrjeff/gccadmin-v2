"use server";

import { clerkClient } from "@clerk/nextjs/server";

export async function getClerkUserAccounts() {
  const client = await clerkClient();

  const users = await client.users.getUserList({ limit: 100 });

  // users that have no role yet
  return users.data
    .filter((u) => !u.publicMetadata.role)
    .map((u) => ({
      clerkId: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.emailAddresses[0].emailAddress,
    }));
}
