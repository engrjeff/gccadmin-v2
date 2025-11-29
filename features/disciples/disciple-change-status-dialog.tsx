"use client";

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
import { updateDiscipleStatus } from "./actions";

interface DiscipleChangeStatusDialogProps
  extends ComponentProps<typeof AlertDialog> {
  discipleName: string;
  discipleId: string;
  isActive: boolean;
}

export function DiscipleChangeStatusDialog({
  discipleName,
  discipleId,
  isActive,
  ...props
}: DiscipleChangeStatusDialogProps) {
  const changeAction = useAction(updateDiscipleStatus, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error updating the disciple's status`);
    },
  });

  const isBusy = changeAction.isPending;

  async function handleDelete() {
    try {
      const result = await changeAction.executeAsync({
        id: discipleId,
        isActive: !isActive,
      });

      if (result.data?.success) {
        toast.success(
          isActive
            ? "The disciple was marked as inactive."
            : "The disciple was marked as active",
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
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will change the status of {discipleName} <br />
            <span className="font-semibold text-blue-500">
              from {isActive ? "ACTIVE" : "INACTIVE"} to{" "}
              {isActive ? "INACTIVE" : "ACTIVE"}
            </span>
            .
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
