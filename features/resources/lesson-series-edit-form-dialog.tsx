"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import {
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import type { LessonSeries } from "@/app/generated/prisma";
import { TagsInput } from "@/components/tags-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { updateLessonSeries } from "./actions";
import {
  type LessonSeriesCreateInputs,
  lessonSeriesCreateSchema,
} from "./schema";

export function LessonSeriesEditFormDialog({
  lessonSeries,
}: {
  lessonSeries: LessonSeries;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="iconSm"
          variant="ghost"
          title={`Edit ${lessonSeries.title}`}
        >
          <PencilIcon />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Edit Series</DialogTitle>
          <DialogDescription>Make sure to save your changes.</DialogDescription>
        </DialogHeader>
        <LessonSeriesEditForm
          lessonSeries={lessonSeries}
          onAfterSave={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function LessonSeriesEditForm({
  lessonSeries,
  onAfterSave,
}: {
  lessonSeries: LessonSeries;
  onAfterSave: VoidFunction;
}) {
  const form = useForm<LessonSeriesCreateInputs>({
    resolver: zodResolver(lessonSeriesCreateSchema),
    defaultValues: {
      title: lessonSeries.title,
      description: lessonSeries.description ?? "",
      tags: lessonSeries.tags,
    },
  });

  const updateAction = useAction(updateLessonSeries, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error updating lesson series`);
    },
  });

  const isBusy = updateAction.isPending;

  const onFormError: SubmitErrorHandler<LessonSeriesCreateInputs> = (
    errors,
  ) => {
    console.log(`Lesson Series Update Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<LessonSeriesCreateInputs> = async (data) => {
    try {
      const result = await updateAction.executeAsync({
        id: lessonSeries.id,
        ...data,
      });

      if (result.data?.lessonSeries) {
        toast.success(
          `Lesson Series: ${result.data.lessonSeries.title} updated!`,
        );

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
      <form onSubmit={form.handleSubmit(onSubmit, onFormError)}>
        <fieldset disabled={isBusy} className="space-y-3 disabled:opacity-90">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Series Title</FormLabel>
                <FormControl>
                  <Input placeholder="Series Title" {...field} />
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
                <FormLabel>Series Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="A short description of this series"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tags{" "}
                  <span className="text-xs italic text-muted-foreground">
                    (Optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <TagsInput
                    value={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="e.g. Christ, Faith, Lordship"
                    hintText="Type in a tag, then hit 'Enter'"
                    aria-invalid={!!form.formState.errors?.tags}
                  />
                </FormControl>
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
