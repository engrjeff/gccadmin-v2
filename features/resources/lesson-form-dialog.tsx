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
import type { LessonSeries } from "@/app/generated/prisma";
import { FaviconImage } from "@/components/favicon-image";
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
import { createLesson } from "./actions";
import { type LessonCreateInputs, lessonCreateSchema } from "./schema";

export function LessonFormDialog({
  lessonSeries,
}: {
  lessonSeries: LessonSeries;
}) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  if (isMobile)
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            size="iconSm"
            variant="ghost"
            title={`Add lesson for ${lessonSeries.title}`}
          >
            <PlusIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="!text-left">
            <DrawerTitle>New Lesson</DrawerTitle>
            <DrawerDescription>
              Add lesson for{" "}
              <span className="text-foreground">{lessonSeries.title}</span>.
              Fill out the form below.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-6">
            <LessonForm
              lessonSeries={lessonSeries}
              onAfterSave={() => setOpen(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="iconSm"
          variant="ghost"
          title={`Add lesson for ${lessonSeries.title}`}
        >
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>New Lesson</DialogTitle>
          <DialogDescription>
            Add lesson for{" "}
            <span className="text-foreground">{lessonSeries.title}</span>. Fill
            out the form below.
          </DialogDescription>
        </DialogHeader>
        <LessonForm
          lessonSeries={lessonSeries}
          onAfterSave={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function LessonForm({
  lessonSeries,
  onAfterSave,
}: {
  lessonSeries: LessonSeries;
  onAfterSave: VoidFunction;
}) {
  const form = useForm<LessonCreateInputs>({
    resolver: zodResolver(lessonCreateSchema),
    defaultValues: {
      lessonSeriesId: lessonSeries.id,
      title: "",
      description: "",
      scriptureReferences: [],
      fileUrl: "",
    },
  });

  const createAction = useAction(createLesson, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error creating lesson`);
    },
  });

  const isBusy = createAction.isPending;

  const onFormError: SubmitErrorHandler<LessonCreateInputs> = (errors) => {
    console.log(`Lesson Add Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<LessonCreateInputs> = async (data) => {
    try {
      const result = await createAction.executeAsync(data);

      if (result.data?.lesson) {
        toast.success(`Lesson: ${result.data.lesson.title} saved!`);

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
            <SubmitButton loading={isBusy}>Save Lesson</SubmitButton>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
