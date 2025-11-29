"use client";

import { LockIcon } from "lucide-react";
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
import { updateAttendanceLockUnlockStatus } from "./actions";

interface Props extends ComponentProps<typeof AlertDialog> {
  attendanceTitle: string;
  attendanceId: string;
  isLocked: boolean;
}

export function AttendanceLockUnlockDialog({
  attendanceTitle,
  attendanceId,
  isLocked,
  ...props
}: Props) {
  const changeAction = useAction(updateAttendanceLockUnlockStatus, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error updating the attendance status`);
    },
  });

  const isBusy = changeAction.isPending;

  async function handleDelete() {
    try {
      const result = await changeAction.executeAsync({
        id: attendanceId,
        isLocked: !isLocked,
      });

      if (result.data?.attendance?.id) {
        toast.success(
          isLocked
            ? "The attendance was locked."
            : "The attendance was unlocked",
        );

        props.onOpenChange?.(false);
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
          <div className="flex items-center gap-3">
            <LockIcon className="size-4 text-amber-500" />
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            This action will{" "}
            <span className="font-semibold text-amber-500">LOCK</span> the
            following attendance: <br />
            <br />
            <span className="font-semibold text-foreground">
              {attendanceTitle}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isBusy}>Cancel</AlertDialogCancel>
          <SubmitButton loading={isBusy} onClick={handleDelete}>
            Continue
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
