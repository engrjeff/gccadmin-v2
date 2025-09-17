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
import { deleteDisciple } from "./actions";

interface DiscipleDeleteDialogProps extends ComponentProps<typeof AlertDialog> {
  discipleName: string;
  discipleId: string;
}

export function DiscipleDeleteDialog({
  discipleName,
  discipleId,
  ...props
}: DiscipleDeleteDialogProps) {
  const deleteAction = useAction(deleteDisciple, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error deleting disciple`);
    },
  });

  const isBusy = deleteAction.isPending;

  async function handleDelete() {
    try {
      const result = await deleteAction.executeAsync({ id: discipleId });

      if (result.data?.success) {
        toast.success("The disciple was deleted successfully.");

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
            This action will delete the disciple{" "}
            <span className="font-semibold text-destructive">
              {discipleName}
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
