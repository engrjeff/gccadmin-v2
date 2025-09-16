import { z } from "zod";

export const assignAccountSchema = z.object({
  leaderId: z.string("Leader ID is required."),
  userAccountId: z
    .string("User account ID is required.")
    .describe("Clerk account user ID"),
  userAccountEmail: z
    .email("User account email is required.")
    .describe("Clerk account user email"),
});

export type AssignAccountInputs = z.infer<typeof assignAccountSchema>;
