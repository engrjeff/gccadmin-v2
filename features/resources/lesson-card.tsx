"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DownloadIcon, PencilIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import {
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import type { Lesson } from "@/app/generated/prisma";
import { FaviconImage } from "@/components/favicon-image";
import { TagsInput } from "@/components/tags-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { updateLesson } from "./actions";
import { type LessonCreateInputs, lessonCreateSchema } from "./schema";

export function LessonCard({ lesson }: { lesson: Lesson }) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="bg-card/60 border rounded-md py-3 space-y-3">
      <div className="flex items-center gap-2 px-3">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold">{lesson.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {lesson.description}
          </p>
          {lesson.scriptureReferences.length === 0 ? null : (
            <div className="flex items-center gap-1.5 flex-wrap">
              {lesson.scriptureReferences.slice(0, 4).map((sc) => (
                <Badge key={`${lesson.id}-scriptureref-${sc}`} variant="MALE">
                  {sc}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto">
          <Button
            size="iconSm"
            variant="ghost"
            aria-label="Edit"
            onClick={() => setEditing(true)}
          >
            <PencilIcon />
          </Button>
          <Button
            disabled={!lesson.fileUrl}
            size="iconSm"
            variant="ghost"
            asChild
          >
            <a
              href={lesson.fileUrl as string}
              target="_blank"
              rel="noopener noreferrer"
              download={lesson.title}
              className="aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-80 aria-disabled:text-muted-foreground"
              aria-disabled={!lesson.fileUrl}
            >
              <DownloadIcon /> <span className="sr-only">Download</span>
            </a>
          </Button>
        </div>
      </div>

      {editing ? (
        <LessonEditForm lesson={lesson} onAfterSave={() => setEditing(false)} />
      ) : null}
    </div>
  );
}

function LessonEditForm({
  lesson,
  onAfterSave,
}: {
  lesson: Lesson;
  onAfterSave: VoidFunction;
}) {
  const form = useForm<LessonCreateInputs>({
    resolver: zodResolver(lessonCreateSchema),
    defaultValues: {
      lessonSeriesId: lesson.lessonSeriesId,
      title: lesson.title,
      description: lesson.description ?? "",
      scriptureReferences: lesson.scriptureReferences,
      fileUrl: lesson.fileUrl ?? "",
    },
  });

  const updateAction = useAction(updateLesson, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error updating lesson`);
    },
  });

  const isBusy = updateAction.isPending;

  const onFormError: SubmitErrorHandler<LessonCreateInputs> = (errors) => {
    console.log(`Lesson Edit Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<LessonCreateInputs> = async (data) => {
    try {
      const result = await updateAction.executeAsync({
        id: lesson.id,
        ...data,
      });

      if (result.data?.lesson) {
        toast.success(`Lesson: ${result.data.lesson.title} updated!`);

        onAfterSave();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  function handleClose() {
    onAfterSave();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onFormError)}
        className="border-t p-3"
      >
        <fieldset disabled={isBusy} className="space-y-3 disabled:opacity-90">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lesson Title</FormLabel>
                <FormControl>
                  <Input placeholder="Lesson Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lesson Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="A short description of this lesson"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scriptureReferences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scripture References</FormLabel>
                <FormControl>
                  <TagsInput
                    value={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="e.g. John 3:16, Romans 6:23"
                    hintText="Type in a verse, then hit 'Enter'"
                    aria-invalid={!!form.formState.errors?.scriptureReferences}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fileUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  File URL{" "}
                  <span className="text-xs italic text-muted-foreground">
                    (Optional)
                  </span>
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type="url"
                      inputMode="url"
                      placeholder="https://somefile.net"
                      className="pl-6"
                      {...field}
                    />
                  </FormControl>
                  <div className="absolute left-2 top-1/2 -translate-y-1/2">
                    <FaviconImage
                      url={form.watch("fileUrl") as string}
                      size={12}
                    />
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end gap-3 pt-6">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <SubmitButton loading={isBusy}>Save Changes</SubmitButton>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
