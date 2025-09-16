import { auth } from "@clerk/nextjs/server";
import type { UserAccountRole } from "@/types/globals";

export const checkRole = async (role: UserAccountRole) => {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata.role === role;
};

export function getSkip({ limit, page }: { limit?: number; page?: number }) {
  const _limit = limit ?? 12;
  const _page = page ?? 1;

  return _limit * (_page - 1);
}
