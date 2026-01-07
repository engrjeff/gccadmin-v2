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
import { promoteAsPrimaryLeader } from "./actions";

interface PromoteToPrimaryDialogProps
  extends ComponentProps<typeof AlertDialog> {
  discipleName: string;
  discipleId: string;
}

export function PromoteToPrimaryDialog(props: PromoteToPrimaryDialogProps) {
  const { discipleName, discipleId, ...dialogProps } = props;

  const action = useAction(promoteAsPrimaryLeader, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error promoting the disciple`);
    },
  });

  const isBusy = action.isPending;

  async function handleAction() {
    try {
      const result = await action.executeAsync({
        id: discipleId,
      });

      if (result.data?.id) {
        toast.success(`${discipleName} was promoted to a primary leader.`);

        props.onOpenChange?.(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will promote{" "}
            <strong className="text-foreground">{discipleName}</strong> into a{" "}
            <strong className="font-semibold text-blue-500">
              Primary Leader
            </strong>
            .
          </AlertDialogDescription>
          <div className="rounded-md border bg-card p-4 text-sm">
            <p className="mb-2 text-foreground">
              This action will result to the following:
            </p>
            <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
              <li>
                This disciple will be removed from his/her current leader;
              </li>
              <li>
                All disciples under this disciple will be assigned directly to
                him/her;
              </li>
              <li>
                He/She must create a GCC Admin account in order to create
                reports.
              </li>
            </ul>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isBusy}>Cancel</AlertDialogCancel>
          <SubmitButton loading={isBusy} onClick={handleAction}>
            Confirm
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
