"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action";
import { lessonCreateSchema, lessonSeriesCreateSchema } from "./schema";

export const createLessonSeries = authActionClient
  .metadata({ actionName: "createLessonSeries" })
  .inputSchema(lessonSeriesCreateSchema)
  .action(async ({ parsedInput }) => {
    const lessonSeries = await prisma.lessonSeries.create({
      data: {
        title: parsedInput.title,
        description: parsedInput.description,
        tags: parsedInput.tags,
      },
    });

    revalidatePath("/resources");

    return {
      lessonSeries,
    };
  });

export const createLesson = authActionClient
  .metadata({ actionName: "createLesson" })
  .inputSchema(lessonCreateSchema)
  .action(async ({ parsedInput }) => {
    const lesson = await prisma.lesson.create({
      data: {
        title: parsedInput.title,
        description: parsedInput.description,
        scriptureReferences: parsedInput.scriptureReferences,
        fileUrl: parsedInput.fileUrl,
        lessonSeriesId: parsedInput.lessonSeriesId,
      },
    });

    revalidatePath("/resources");

    return {
      lesson,
    };
  });
