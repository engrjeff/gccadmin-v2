"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import {
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
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
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { createLessonSeries } from "./actions";
import {
  type LessonSeriesCreateInputs,
  lessonSeriesCreateSchema,
} from "./schema";

export function LessonSeriesFormDialog() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  if (isMobile)
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button size="sm">
            <PlusIcon /> Add Series
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="!text-left">
            <DrawerTitle>New Lesson Series</DrawerTitle>
            <DrawerDescription>Fill out the form below.</DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto p-6">
            <LessonSeriesForm onAfterSave={() => setOpen(false)} />
          </div>
        </DrawerContent>
      </Drawer>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon /> Add Series
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add Lesson Series</DialogTitle>
          <DialogDescription>Fill out the form below.</DialogDescription>
        </DialogHeader>
        <LessonSeriesForm onAfterSave={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function LessonSeriesForm({ onAfterSave }: { onAfterSave: VoidFunction }) {
  const form = useForm<LessonSeriesCreateInputs>({
    resolver: zodResolver(lessonSeriesCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
    },
  });

  const createAction = useAction(createLessonSeries, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error creating lesson series`);
    },
  });

  const isBusy = createAction.isPending;

  const onFormError: SubmitErrorHandler<LessonSeriesCreateInputs> = (
    errors,
  ) => {
    console.log(`Lesson Series Create Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<LessonSeriesCreateInputs> = async (data) => {
    try {
      const result = await createAction.executeAsync(data);

      if (result.data?.lessonSeries) {
        toast.success(
          `Lesson Series: ${result.data.lessonSeries.title} saved!`,
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
                  <span className="text-muted-foreground text-xs italic">
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
            <SubmitButton loading={isBusy}>Save Series</SubmitButton>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
