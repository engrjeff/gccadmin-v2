import { z } from "zod";

export const lessonSeriesCreateSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(1, { error: "Title is required" }),
  description: z.string().optional(),
  tags: z.string().array().min(1, { error: "Provide at least 1 tag" }),
});

export const lessonSeriesIdSchema = z.object({
  id: z.string({ error: "Series ID is required." }),
});

export const lessonCreateSchema = z.object({
  lessonSeriesId: z.string({
    error: "Series ID is required",
  }),
  title: z
    .string({ error: "Title is required" })
    .min(1, { error: "Title is required" }),
  description: z.string().optional(),
  scriptureReferences: z
    .string()
    .array()
    .min(1, { error: "Provide at least 1 verse" }),
  fileUrl: z
    .url({ error: "Provide a valid file URL" })
    .optional()
    .or(z.literal("")),
});

export const lessonIdSchema = z.object({
  id: z.string({ error: "Lesson ID is required." }),
});

export type LessonCreateInputs = z.infer<typeof lessonCreateSchema>;

export type LessonSeriesCreateInputs = z.infer<typeof lessonSeriesCreateSchema>;
