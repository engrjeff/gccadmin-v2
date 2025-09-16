// Create a type for the roles
export type UserAccountRole = "admin" | "leader" | "stranger";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: UserAccountRole;
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
