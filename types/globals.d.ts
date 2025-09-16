// Create a type for the roles
export type UserAccountRole = "admin" | "leader" | "stranger";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: UserAccountRole;
    };
  }
}
