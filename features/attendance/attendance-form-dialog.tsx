"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import {
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { AttendanceType } from "@/app/generated/prisma";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { useIsMobile } from "@/hooks/use-mobile";
import { createAttendance } from "./actions";
import { type AttendanceCreateInputs, attendanceCreateSchema } from "./schema";

export function AttendanceFormDialog() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  if (isMobile)
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button size="sm">
            <PlusIcon /> Add Attendance
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="!text-left">
            <DrawerTitle>Create New Attendance</DrawerTitle>
            <DrawerDescription>Fill out the form below.</DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto p-6">
            <AttendanceForm onAfterSave={() => setOpen(false)} />
          </div>
        </DrawerContent>
      </Drawer>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon /> Add Attendance
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Create New Attendance</DialogTitle>
          <DialogDescription>Fill out the form below.</DialogDescription>
        </DialogHeader>
        <AttendanceForm onAfterSave={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function AttendanceForm({ onAfterSave }: { onAfterSave: VoidFunction }) {
  const router = useRouter();

  const form = useForm<AttendanceCreateInputs>({
    resolver: zodResolver(attendanceCreateSchema),
    defaultValues: {
      title: `Sunday Service - ${format(new Date(), "MMM dd, yyyy")}`,
      type: AttendanceType.SUNDAY_SERVICE,
      date: format(new Date(), "yyyy-MM-dd"),
      tags: [],
    },
  });

  const createAction = useAction(createAttendance, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(
        error.serverError ?? `Error creating attendance record series`,
      );
    },
  });

  const isBusy = createAction.isPending;

  const onFormError: SubmitErrorHandler<AttendanceCreateInputs> = (errors) => {
    console.log(`Attendance Create Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<AttendanceCreateInputs> = async (data) => {
    try {
      const result = await createAction.executeAsync(data);

      if (result.data?.attendance?.id) {
        const attendance = result.data.attendance;
        toast.success(
          `${attendance.type.replaceAll("_", " ")} Attendance: ${attendance.title} saved!`,
        );

        onAfterSave();

        router.push(`/attendance/${attendance.id}`);
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
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  defaultValue={field.value}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger id="type" className="w-full">
                      <SelectValue placeholder="Select attendance type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={AttendanceType.SUNDAY_SERVICE}>
                      Sunday Service
                    </SelectItem>
                    <SelectItem value={AttendanceType.EVENT}>Event</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Attendance Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="w-max">
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    placeholder="Date"
                    pattern="\d{4}-\d{2}-\d{2}"
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
                    placeholder="e.g. Service, Gathering, Special Sunday"
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
            <SubmitButton loading={isBusy}>Save Attendance</SubmitButton>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
