import z from "zod";
import {
  CellStatus,
  ChurchStatus,
  Gender,
  MemberType,
  ProcessLevel,
  ProcessLevelStatus,
} from "@/app/generated/prisma";

export const discipleCreateSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  birthdate: z
    .string({ message: "Birthdate is required" })
    .regex(/\d{4}-\d{2}-\d{2}/, { message: "Invalid birthdate" }),
  gender: z.enum(Gender),
  memberType: z.enum(MemberType, { error: "Invalid member type" }),
  cellStatus: z.enum(CellStatus, { error: "Invalid cell status" }),
  churchStatus: z.enum(ChurchStatus, { error: "Invalid church status" }),
  processLevel: z.enum(ProcessLevel, { error: "Invalid process level" }),
  processLevelStatus: z.enum(ProcessLevelStatus, {
    error: "Invalid process status",
  }),
  handledById: z.string().optional(),
  leaderId: z.string().optional(), // for admin
  isMyPrimary: z.boolean().optional(),
});

export const importDisciplesSchema = z.object({
  disciples: z.array(discipleCreateSchema).superRefine((items, ctx) => {
    const uniqueItemsCount = new Set(
      items.map((item) => item.name.toLowerCase()),
    ).size;

    const errorPosition = items.length - 1;

    if (uniqueItemsCount !== items.length) {
      ctx.addIssue({
        code: "custom",
        message: `${items[errorPosition]?.name} already exists.`,
        path: [errorPosition, "name"],
      });
    }
  }),
});

export const discipleIdSchema = z.object({
  id: z
    .string({ error: "Disciple ID is required." })
    .min(1, { error: "Disciple ID is required." }),
});

export const discipleStatusChangeSchema = z.object({
  id: z
    .string({ error: "Disciple ID is required." })
    .min(1, { error: "Disciple ID is required." }),
  isActive: z.boolean(),
});

export const discipleUpdateSchema = discipleCreateSchema.extend(
  discipleIdSchema.shape,
);

export type DiscipleCreateInputs = z.infer<typeof discipleCreateSchema>;

export type DiscipleImportInputs = z.infer<typeof importDisciplesSchema>;
