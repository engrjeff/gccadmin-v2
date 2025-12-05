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
import { deleteNewBeliever } from "./actions";

interface NewBelieverDeleteDialogProps
  extends ComponentProps<typeof AlertDialog> {
  name: string;
  id: string;
}

export function NewBelieverDeleteDialog({
  id,
  name,
  ...props
}: NewBelieverDeleteDialogProps) {
  const deleteAction = useAction(deleteNewBeliever, {
    onError: ({ error }) => {
      console.error(error);

      toast.error(
        error.serverError ?? "Error deleting the new believer record.",
      );
    },
  });

  const isBusy = deleteAction.isPending;

  async function handleDelete() {
    try {
      const result = await deleteAction.executeAsync({ id });

      if (result.data?.success) {
        toast.success(`The new believer record was deleted successfully.`);

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
            This action will delete{" "}
            <span className="font-semibold text-destructive">{name}</span> and
            will remove him/her from Soul-Winning and Consolidation report
            records.
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
