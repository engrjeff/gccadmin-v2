"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useAction } from "next-safe-action/hooks";
import {
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { type Attendance, AttendanceType } from "@/app/generated/prisma";
import { TagsInput } from "@/components/tags-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormDescription,
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
import { editAttendance } from "./actions";
import { type AttendanceEditInputs, attendanceEditSchema } from "./schema";

export function AttendanceFormEditDialog({
  open,
  setOpen,
  attendance,
}: {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  attendance: Attendance;
}) {
  const isMobile = useIsMobile();

  if (isMobile)
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader className="!text-left">
            <DrawerTitle>Update Attendance</DrawerTitle>
            <DrawerDescription>
              Make sure to save your changes.
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto p-6">
            <AttendanceEditForm
              attendance={attendance}
              onAfterSave={() => setOpen(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Update Attendance</DialogTitle>
          <DialogDescription>Make sure to save your changes.</DialogDescription>
        </DialogHeader>
        <AttendanceEditForm
          attendance={attendance}
          onAfterSave={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function AttendanceEditForm({
  onAfterSave,
  attendance,
}: {
  onAfterSave: VoidFunction;
  attendance: Attendance;
}) {
  const form = useForm<AttendanceEditInputs>({
    resolver: zodResolver(attendanceEditSchema),
    defaultValues: {
      id: attendance.id,
      title: attendance.title,
      type: attendance.type,
      date: format(attendance.date, "yyyy-MM-dd"),
      tags: attendance.tags,
    },
  });

  const updateAction = useAction(editAttendance, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error updating attendance record`);
    },
  });

  const isBusy = updateAction.isPending;

  const onFormError: SubmitErrorHandler<AttendanceEditInputs> = (errors) => {
    console.log(`Attendance Update Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<AttendanceEditInputs> = async (data) => {
    try {
      const result = await updateAction.executeAsync(data);

      if (result.data?.attendance?.id) {
        const attendance = result.data.attendance;
        toast.success(
          `${attendance.type.replaceAll("_", " ")} Attendance: ${attendance.title} saved!`,
        );

        form.reset();

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
          <input
            type="hidden"
            defaultValue={attendance.id}
            {...form.register("id")}
          />
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
                <FormDescription>You can rename this</FormDescription>
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
            <SubmitButton loading={isBusy}>Save Changes</SubmitButton>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
