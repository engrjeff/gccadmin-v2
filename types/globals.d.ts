import type { Disciple } from "@/app/generated/prisma";

// Create a type for the roles
export type UserAccountRole = "admin" | "leader" | "stranger";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: UserAccountRole;
      pastor?: boolean;
    };
  }
}

export type PageInfo = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  itemCount: number;
};

export type Option = {
  label: string;
  value: string;
};

export type DateRange =
  | "this_week"
  | "last_week"
  | "this_month"
  | "last_month"
  | "last_last_month";

export interface DiscipleRecord extends Disciple {
  leader: Pick<Disciple, "id" | "name"> | null;
  handledBy: Pick<Disciple, "name"> | null;
}
