"use client";

import { useAction } from "next-safe-action/hooks";
import type { ComponentProps } from "react";
import { toast } from "sonner";
import { SoulWinningReportType } from "@/app/generated/prisma";
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
import { removeUnderscores } from "@/lib/utils";
import { deleteSoulWinningOrConsoReport } from "./actions";

interface WinAndConsoDeleteDialogProps
  extends ComponentProps<typeof AlertDialog> {
  type: SoulWinningReportType;
  reportId: string;
}

export function WinAndConsoDeleteDialog({
  type,
  reportId,
  ...props
}: WinAndConsoDeleteDialogProps) {
  const deleteAction = useAction(deleteSoulWinningOrConsoReport, {
    onError: ({ error }) => {
      console.error(error);
      const defaultErrorMessage =
        type === SoulWinningReportType.SOUL_WINNING
          ? `Error deleting soul-winning report`
          : `Error deleting consolidation record`;
      toast.error(error.serverError ?? defaultErrorMessage);
    },
  });

  const reportType = SoulWinningReportType.SOUL_WINNING
    ? "Soul-winning"
    : "Consolidation";

  const isBusy = deleteAction.isPending;

  async function handleDelete() {
    try {
      const result = await deleteAction.executeAsync({ id: reportId });

      if (result.data?.success) {
        toast.success(`The ${reportType} report was deleted successfully.`);

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
            This action will delete the{" "}
            <span className="font-semibold text-foreground capitalize">
              {removeUnderscores(type)}
            </span>{" "}
            report.
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
