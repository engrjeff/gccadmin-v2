import { auth } from "@clerk/nextjs/server";
import type { UserAccountRole } from "@/types/globals";

export const checkRole = async (role: UserAccountRole) => {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata.role === role;
};
