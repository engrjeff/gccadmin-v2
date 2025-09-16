import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clerkClient();

  const userList = await client.users.getUserList({ limit: 100 });

  // users that have no role yet
  const users = userList.data
    .filter((u) => !u.publicMetadata.role)
    .map((u) => ({
      clerkId: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.emailAddresses[0].emailAddress,
    }));

  return NextResponse.json(users);
}
