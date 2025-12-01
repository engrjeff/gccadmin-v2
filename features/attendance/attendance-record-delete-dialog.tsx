"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import type { ComponentProps } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SubmitButton } from "@/components/ui/submit-button";
import { deleteAttendance } from "./actions";

interface DiscipleDeleteDialogProps extends ComponentProps<typeof AlertDialog> {
  attendanceId: string;
  attendanceTitle: string;
}

export function AttendanceRecordDeleteDialog({
  attendanceTitle,
  attendanceId,
  ...props
}: DiscipleDeleteDialogProps) {
  const router = useRouter();

  const deleteAction = useAction(deleteAttendance, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error deleting attendance record`);
    },
  });

  const isBusy = deleteAction.isPending;

  async function handleDelete() {
    try {
      const result = await deleteAction.executeAsync({ id: attendanceId });

      if (result.data?.success) {
        toast.success("The attendance record was deleted successfully.");

        props.onOpenChange?.(false);

        router.replace("/attendance");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will delete the record{" "}
            <span className="font-semibold text-destructive">
              {attendanceTitle}
            </span>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isBusy}>Cancel</AlertDialogCancel>
          <SubmitButton
            variant="destructive"
            loading={isBusy}
            onClick={handleDelete}
          >
            Continue
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
